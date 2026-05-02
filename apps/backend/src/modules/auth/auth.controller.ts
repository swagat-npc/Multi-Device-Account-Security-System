import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { CurrentUser } from '../../common/decorators/currentuser.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() register: RegisterDto) {
    return this.authService.register(register);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getMe(@CurrentUser() user: any) {
    return this.authService.getMe(user.sub);
  }

  @Post("login")
  async login(@Body() login: LoginDto, @Res({ passthrough: true }) res: any, @Req() req: any) {
    return this.authService.login(login, res, req);
  }

  @Post("refresh")
  refresh(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refreshToken;

    return this.authService.refresh(refreshToken, res);
  }

  @HttpCode(200)
  @Post("logout")
  logout(@Res({passthrough: true}) res: Response) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return { message: "Logged out successfully" };;
  }

  @Post("logout-all")
  logoutAll(@Req() req: any) {
    return this.authService.revokeAllSessionsForUser(req.user.userId);
  }
}