import * as mongoose from 'mongoose';

export const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  refreshTokenHash: { type: String, required: true },
  tokenVersion: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  lastUsedAt: { type: Date },
  expiresAt: { type: Date, required: true },
  reusedDetectedAt: { type: Date },
  revoked: { type: Boolean, default: false },
  replacedByToken: { type: String },
  userAgent: { type: String },
  deviceName: { type: String },
  ipAddress: { type: String }
},{ versionKey: false });
SessionSchema.index({ userId: 1 });