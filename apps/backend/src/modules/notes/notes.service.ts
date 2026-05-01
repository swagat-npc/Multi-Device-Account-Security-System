import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNoteDto, UpdateNoteDto, NoteAccessDto } from './dto/note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel('Note') private readonly noteModel: Model<any>,
    @InjectModel('NoteAccess') private readonly noteAccessModel: Model<any>,
  ) {}

  async create(Note: CreateNoteDto) {
    try {
      const note = new this.noteModel(Note);
      const savedNote = await note.save();
  
      const obj = savedNote.toObject();
      // delete obj.createdAt;
      // delete obj.updatedAt;
      // delete obj.isHidden;
      // delete obj._id;
      // delete obj.userId;
  
      return obj;
    } catch (error: any) {
      throw new Error('Failed to create note. ' + error.message);
    }
  }

  async findAll() {
    return this.noteModel.find().exec();
  }

  async findOne(id: string) {
    return this.noteModel.findById(id).exec();
  }

  async findByUserId(userId: string) {
    return this.noteModel.find({ userId }).exec();
  }

  async update(id: string, note: UpdateNoteDto) {
    const updatedNote = await this.noteModel.findByIdAndUpdate(id, { content: note.content, isHidden: note.isHidden }, { new: true }).exec();
    if (!updatedNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    // const obj = updatedNote.toObject();
    // delete obj.createdAt;
    // delete obj.updatedAt;
    // delete obj.isHidden;
    // delete obj._id;
    // delete obj.userId;
    
    // return obj;
    
    return updatedNote;
  }

  async share(id: string, shareData: NoteAccessDto) {
    const { userId, permission } = shareData;
    const noteAccess = new this.noteAccessModel({ noteId: id, userId, permission });
    return noteAccess.save();
  }

  async getAccess(id: string) {
    return this.noteAccessModel.find({ noteId: id }).exec();
  }

  async delete(id: string) {
    return this.noteModel.findByIdAndDelete(id).exec();
  }
}