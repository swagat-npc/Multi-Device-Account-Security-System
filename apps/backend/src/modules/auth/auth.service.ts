import { Injectable, UnauthorizedException } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";
import { UserService } from "../users/users.service";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import Parser from "ua-parser-js";
import { Response } from "express";
import { Model } from "mongoose";

/*
Notes
- verify credentials
- compare passwords
- tokens, sessions
*/

const IDLE_TIMEOUT_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days
const ACCESS_TOKEN_TTL = 1 * 60 * 1000; // TODO: change to 15 minutes

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Session') private readonly sessionModel: Model<any>,
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

  async login(
    loginData: LoginDto,
    res: Response,
    req: any,
  ): Promise<LoginResponseDto> {
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
      secret: this.config.getOrThrow<string>("JWT_REFRESH_SECRET"),
      expiresIn: "7d",
    });
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    const parser = new Parser.UAParser(req.headers["user-agent"] || "");

    const deviceName = parser.getDevice() || {
      type: "Unknown",
      vendor: "Unknown",
      model: "",
    };
    const os = parser.getOS() || { name: "Unknown", version: "" };
    const browser = parser.getBrowser() || { name: "Unknown", version: "" };
    const now = new Date();
    await this.sessionModel.create({
      userId: user._id,
      refreshTokenHash: hashedRefreshToken,
      lastActivityAt: now,
      expiresAt: new Date(now.getTime() + REFRESH_TOKEN_TTL),
      idleExpiresAt: new Date(now.getTime() + IDLE_TIMEOUT_MS),
      revoked: false,
      userAgent: req.headers["user-agent"] || "Unknown",
      deviceName: `${deviceName.type} ${os.name} ${browser.name}`.trim(),
      ipAddress: req.ip || "Unknown",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "lax",
      maxAge: ACCESS_TOKEN_TTL,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "lax",
      maxAge: REFRESH_TOKEN_TTL,
    });

    return { message: "Login successful" };
  }

  async refresh(refreshToken: string, res: Response) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.config.getOrThrow<string>("JWT_REFRESH_SECRET"),
    });

    const session = await this.sessionModel
      .findOne({ userId: payload.sub, revoked: false })
      .exec();

    if (!session) {
      throw new UnauthorizedException("Session not found");
    }

    // Check if session is idle expired
    const now = new Date();
    if (session.idleExpiresAt < now) {
      session.revoked = true;
      await session.save();

      throw new UnauthorizedException("Session expired due to inactivity");
    }

    // Check if refresh token is valid
    const isValid = await bcrypt.compare(
      refreshToken,
      session.refreshTokenHash,
    );

    if (!isValid) {
      session.revoked = true;
      session.reusedDetectedAt = new Date();
      await session.save();
      throw new UnauthorizedException(
        "Refresh token reuse detected. Session revoked.",
      );
    }

    // Rotate session
    session.lastActivityAt = now;
    session.idleExpiresAt = new Date(now.getTime() + IDLE_TIMEOUT_MS);

    const newRefreshToken = this.jwtService.sign(
      { sub: payload.sub, email: payload.email },
      {
        secret: this.config.getOrThrow<string>("JWT_REFRESH_SECRET"),
        expiresIn: "7d",
      },
    );
    session.refreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

    await session.save();

    const newAccessToken = this.jwtService.sign(
      { sub: payload.sub, email: payload.email },
      {
        expiresIn: "15m",
      },
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "lax",
      maxAge: ACCESS_TOKEN_TTL,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "lax",
      maxAge: REFRESH_TOKEN_TTL,
    });

    return { message: "Token refreshed" };
  }

  async revokeAllSessionsForUser(userId: string) {
    await this.sessionModel.updateMany(
      { userId, revoked: false },
      { revoked: true },
    );
  }
}
