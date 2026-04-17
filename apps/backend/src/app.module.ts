import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/users/users.module';
import { SessionModule } from './modules/sessions/sessions.module';
import { NoteModule } from './modules/notes/notes.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';

ConfigModule.forRoot({
  isGlobal: true,
});
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI! + process.env.DATABASE_NAME!),
    AuthModule,
    UserModule,
    SessionModule,
    NoteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}