import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/users/users.module';
import { SessionModule } from './modules/sessions/sessions.module';
import { NotesModule } from './modules/notes/notes.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGO_URI') + config.getOrThrow<string>('DATABASE_NAME')
      }),
    }),
    AuthModule,
    UserModule,
    SessionModule,
    NotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}