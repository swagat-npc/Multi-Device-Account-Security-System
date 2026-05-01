import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNoteDto, UpdateNoteDto, NoteAccessDto } from './dto/note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel('Note') private readonly noteModel: Model<any>,
    @InjectModel('NoteAccess') private readonly noteAccessModel: Model<any>,
  ) {}

  async create(Note: CreateNoteDto, userId: String) {
    try {
      const note = new this.noteModel({ ...Note, userId });
      const savedNote = await note.save();
  
      // const obj = savedNote.toObject();
      // delete obj.createdAt;
      // delete obj.updatedAt;
      // delete obj.isHidden;
      // delete obj._id;
      // delete obj.userId;
  
      // return obj;
      return savedNote;
    } catch (error: any) {
      throw new Error('Failed to create note. ' + error.message);
    }
  }

  async findAll(userId: string) {
    return this.noteModel.find({ userId }).exec();
  }

  async findOne(noteId: string, userId: string) {
    const allowed = await this.canAccessNotes(noteId, userId);

    if (!allowed) {
      throw new ForbiddenException(`Access denied to note with ID ${noteId}`);
    }
    
    return this.noteModel.findById(noteId).exec();
  }

  async findByUserId(userId: string) {
    return this.noteModel.find({ userId }).exec();
  }

  async update(noteId: string, note: UpdateNoteDto, userId: string) {
    const allowed = await this.canAccessNotes(noteId, userId);

    if (!allowed) {
      throw new ForbiddenException(`Access denied to note with ID ${noteId}`);
    }
    
    const updatedNote = await this.noteModel.findByIdAndUpdate(noteId, { content: note.content, isHidden: note.isHidden }, { new: true }).exec();
    
    // const obj = updatedNote.toObject();
    // delete obj.createdAt;
    // delete obj.updatedAt;
    // delete obj.isHidden;
    // delete obj._id;
    // delete obj.userId;
    // return obj;

    return updatedNote;
  }

  async canAccessNotes(noteId: string, userId: string): Promise<boolean> {
    // does note exist?
    const note = await this.noteModel.findById(noteId).exec();

    if (!note) return false;
    
    // is the current user the owner of the note?
    if (note.userId.toString() === userId) return true;

    // does the user have shared access to the note?
    const noteAccess = await this.noteAccessModel.findOne({
      noteId,
      userId,
    }).exec();

    return !!noteAccess;
  }

  async delete(noteId: string, userId: string) {
    const allowed = await this.canAccessNotes(noteId, userId);

    if (!allowed) {
      throw new ForbiddenException(`Access denied to note with ID ${noteId}`);
    }

    return this.noteModel.findByIdAndDelete(noteId).exec();
  }

  async share(noteId: string, ownerId: string, shareData: NoteAccessDto) {
    const note = await this.noteModel.findById(noteId).exec();

    if (!note || note.userId.toString() !== ownerId) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }

    const existing = await this.noteAccessModel.findOne({ noteId, userId: shareData.userId }).exec();

    if (existing) {
      throw new ConflictException(`User with ID ${shareData.userId} already has access to note with ID ${noteId}`);
    }

    const { userId, permission } = shareData;
    const noteAccess = this.noteAccessModel.create({ 
      noteId: noteId,
      userId,
      permission
    });
    
    return noteAccess;
  }

  async getAccess(id: string) {
    return this.noteAccessModel.find({ noteId: id }).exec();
  }
}