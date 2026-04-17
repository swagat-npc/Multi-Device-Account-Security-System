import { Body, Controller, Post } from '@nestjs/common';
import { SessionService } from './sessions.service';

@Controller()
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  create(@Body() session: any) {
    return this.sessionService.create(session);
  }
}