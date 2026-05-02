import { Module } from '@nestjs/common';
import { SessionController } from './sessions.controller';
import { SessionService } from './sessions.service';
// import { MongooseModule } from '@nestjs/mongoose';
// import { SessionSchema } from '../auth/session.schema';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   { name: 'Session', schema: SessionSchema },
    // ]),
  ],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}