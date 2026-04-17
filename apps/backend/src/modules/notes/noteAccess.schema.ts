import * as mongoose from 'mongoose';

export const NoteAccessSchema = new mongoose.Schema({
  noteId: { type: String, required: true },
  userId: { type: String, required: true },
  permission: { type: String, enum: ['VIEW', 'EDIT', 'FULL'], required: true },
},{ versionKey: false });