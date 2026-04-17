import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel('Session') private readonly sessionModel: Model<any>,
  ) {}

  async create(sessionData: any) {
    const session = new this.sessionModel(sessionData);
    return session.save();
  }
}