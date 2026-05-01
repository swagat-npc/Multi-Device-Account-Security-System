import * as mongoose from 'mongoose';

export const NoteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  content: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
},{ versionKey: false, timestamps: true });