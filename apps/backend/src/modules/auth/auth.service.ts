import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

    register(registerData: RegisterDto): Promise<any> {
        const passwordHash = this.hashPassword(registerData.password);
        const userData = { ...registerData, passwordHash };
        return this.userService.create(userData);
    }

    hashPassword(password: string): string {
        return bcrypt.hashSync(password, 10);
    }
}