import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Note') private readonly noteModel: Model<any>,
    @InjectModel('NoteAccess') private readonly noteAccessModel: Model<any>,
  ) {}

  async create(Note: any) {
    const note = new this.noteModel(Note);
    return note.save();
  }
}