import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './notes.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() note: any) {
    return this.authService.create(note);
  }
}