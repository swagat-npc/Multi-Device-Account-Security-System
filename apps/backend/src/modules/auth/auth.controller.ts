import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() register: RegisterDto) {
    return this.authService.register(register);
  }

  @Post("login")
  async login(@Body() login: LoginDto, @Req() req: any) {
    return this.authService.login(login, req);
  }

  @Post("refresh")
  refresh(@Body() body: any) {
    return this.authService.refresh(body.refreshToken, body.sessionId);
  }

  @Post("logout")
  logout(@Body() body: any) {
    return this.authService.logout(body.sessionId);
  }

  @Post("logout-all")
  logoutAll(@Req() req: any) {
    return this.authService.revokeAllSessionsForUser(req.user.userId);
  }
}