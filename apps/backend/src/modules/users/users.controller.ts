import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { UserService } from './users.service';

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  register(@Body() user: any) {
    return this.userService.create(user);
  }

  @Get("all")
  findAll() {
    return this.userService.findAll();
  }

  @Delete("delete")
  delete(@Body("id") id: string) {
    return this.userService.delete(id);
  }
}