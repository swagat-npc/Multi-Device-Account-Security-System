import { Module } from '@nestjs/common';
import { AuthController } from './notes.controller';
import { AuthService } from './notes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteSchema } from './note.schema';
import { NoteAccessSchema } from './noteAccess.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Note', schema: NoteSchema },
      { name: 'NoteAccess', schema: NoteAccessSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class NoteModule {}