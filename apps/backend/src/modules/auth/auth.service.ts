import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/users.service';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

/*
Notes
- verify credentials
- compare passwords
- tokens, sessions
*/

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) {}

    register(registerData: RegisterDto): Promise<any> {
        const passwordHash = this.hashPassword(registerData.password);
        const userData = { ...registerData, passwordHash };
        return this.userService.create(userData);
    }

    hashPassword(password: string): string {
        return bcrypt.hashSync(password, 10);
    }

    async login(loginData: LoginDto): Promise<LoginResponseDto> {
        const user = await this.userService.findByEmail(loginData.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginData.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user._id.toString(), email: user.email };
        const accessToken = this.jwtService.sign(payload);
        
        return { 
            accessToken,
            tokenType: 'Bearer'
        };
    }

    validateToken(token: string): any {
        try {
            return this.jwtService.verify(token);
        } catch (error: any) {
            throw new UnauthorizedException('Invalid token: ' + error.message);
        }
    }
}