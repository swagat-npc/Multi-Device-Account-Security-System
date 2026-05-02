import { Injectable, UnauthorizedException } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { UserService } from "../users/users.service";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import Parser from "ua-parser-js";


/*
Notes
- verify credentials
- compare passwords
- tokens, sessions
*/

@Injectable()
export class AuthService {
  constructor(
    @InjectModel("Session") private readonly sessionModel: any,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly config: ConfigService,
  ) {}

  register(registerData: RegisterDto): Promise<any> {
    const passwordHash = this.hashPassword(registerData.password);
    const userData = { ...registerData, passwordHash };
    return this.userService.create(userData);
  }

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  async login(loginData: LoginDto, req: any): Promise<LoginResponseDto> {
    const user = await this.userService.findByEmail(loginData.email);

    if (!user) {
      throw new UnauthorizedException("Invalid username");
    }

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid password");
    }

    const payload = { sub: user._id.toString(), email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: "15m",
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>("JWT_REFRESH_SECRET"),
      expiresIn: "7d",
    });
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

	const parser = new Parser.UAParser(req.headers["user-agent"] || "");

	const deviceName = parser.getDevice() || { type: "Unknown", vendor: "Unknown", model: "" };
	const os = parser.getOS() || { name: "Unknown", version: "" };
	const browser = parser.getBrowser() || { name: "Unknown", version: "" };

    const session = await this.sessionModel.create({
      userId: user._id,
      refreshTokenHash: hashedRefreshToken,
      tokenVersion: 0,
      createdAt: new Date(),
      lastUsedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      revoked: false,
      userAgent: req.headers["user-agent"] || "Unknown",
      deviceName: `${deviceName.type} ${os.name} ${browser.name}`.trim(),
      ipAddress: req.ip || "Unknown",
    });

    return {
      accessToken,
      refreshToken,
      sessionId: session._id.toString(),
    };
  }

  async refresh(refreshToken: string, sessionId: string) {
    const session = await this.sessionModel.findById(sessionId);

    if (!session || session.revoked) {
      throw new UnauthorizedException("Invalid session");
    }

    const payload = this.jwtService.verify(refreshToken, {
      secret: this.config.get<string>("JWT_REFRESH_SECRET"),
    });

    if (payload.sub !== session.userId.toString()) {
      throw new UnauthorizedException("Token user mismatch");
    } else if (payload.version !== session.tokenVersion) {
      session.reusedDetectedAt = new Date();
      await session.save();

      throw new UnauthorizedException("Token version mismatch");
    }

    session.tokenVersion += 1;
    session.lastUsedAt = new Date();
	const now = new Date();
	const maxIdleTime = 7 * 24 * 60 * 60 * 1000;

	if (now.getTime() - session.lastUsedAt.getTime() > maxIdleTime) {
      session.revoked = true;
	  throw new UnauthorizedException("Session expired due to inactivity");
    }

    await session.save();

    const newAccessToken = this.jwtService.sign(
      { sub: payload.sub, email: payload.email },
      { expiresIn: "15m" },
    );

    const newRefreshToken = this.jwtService.sign(
      { sub: payload.sub, email: payload.email, version: session.tokenVersion },
      {
        secret: this.config.get<string>("JWT_REFRESH_SECRET"),
        expiresIn: "7d",
      },
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  validateToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error: any) {
      throw new UnauthorizedException("Invalid token: " + error.message);
    }
  }

  async logout(sessionId: string) {
    const session = await this.sessionModel.findByIdAndUpdate(sessionId, {
      revoked: true,
    });
    return session;
  }

  async revokeAllSessionsForUser(userId: string) {
	await this.sessionModel.updateMany(
	  { userId, revoked: false },
	  { revoked: true }
	);
  }
}
