import * as mongoose from 'mongoose';

export const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  refreshTokenHash: { type: String, required: true },
  revoked: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
  lastActivityAt: { type: Date, default: Date.now },
  idleExpiresAt: { type: Date, required: true },
  reusedDetectedAt: { type: Date },
  replacedByToken: { type: String },
  userAgent: { type: String },
  deviceName: { type: String },
  ipAddress: { type: String }
},{ versionKey: false });
SessionSchema.index({ userId: 1 });