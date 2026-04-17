import * as mongoose from 'mongoose';

export const NoteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  content: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
},{ versionKey: false });