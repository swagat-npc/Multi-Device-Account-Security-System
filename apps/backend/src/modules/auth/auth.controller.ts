import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() register: RegisterDto) {
    return this.authService.register(register);
  }

//   @Post()
//   login(): { message: string } {
//     return this.authService.getHello();
//   }

//   @Post()
//   refresh(): { message: string } {
//     return this.authService.getHello();
//   }

//   @Post()
//   logout(): { message: string } {
//     return this.authService.getHello();
//   }
}