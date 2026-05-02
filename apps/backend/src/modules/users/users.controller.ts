import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/currentuser.decorator';

@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Post()
  register(@Body() user: any) {
    return this.userService.create(user);
  }

  @Get("all")
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@CurrentUser() user: any) {
    return this.userService.findById(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("me")
  delete(@CurrentUser() user: any) {
    return this.userService.delete(user.sub);
  }
}