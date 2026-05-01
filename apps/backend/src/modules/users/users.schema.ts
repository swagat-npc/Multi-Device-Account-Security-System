import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  passwordHash: { type: String, required: true, select: false },
  avatar: { type: String },
  isActive: { type: Boolean, default: true, select: false },
  createdAt: { type: Date, default: Date.now, select: false },
  updatedAt: { type: Date, default: Date.now, select: false }
},{ versionKey: false });