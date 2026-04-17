import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<any>,
  ) {}

  async create(userData: any): Promise<any> {
    try {
      const user = new this.userModel(userData);
      const savedUser = await user.save();

      const obj = savedUser.toObject();
      delete obj.passwordHash;

      return obj;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<any[]> {
    return this.userModel.find().exec();
  }
}