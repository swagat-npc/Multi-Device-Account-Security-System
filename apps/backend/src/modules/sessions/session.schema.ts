import * as mongoose from 'mongoose';

export const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  refreshTokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  lastUsedAt: { type: Date },
  revoked: { type: Boolean, default: false },
  replacedByToken: { type: String },
  userAgent: { type: String },
  ipAddress: { type: String }
},{ versionKey: false });
SessionSchema.index({ userId: 1 });