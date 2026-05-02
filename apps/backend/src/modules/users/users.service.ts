import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

/*
Notes
- create user
- find user
- query DB
*/

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<any>
  ) {}

  async create(userData: any): Promise<any> {
    try {
      const user = new this.userModel(userData);
      const savedUser = await user.save();

      const obj = savedUser.toObject();
      delete obj.passwordHash;
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.isActive;
      delete obj._id;

      return obj;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<any[]> {
    return this.userModel
      .find()
      .exec();
  }

  async findByEmail(email: string): Promise<any> {
    return this.userModel
      .findOne({ email })
      .select('+passwordHash')
      .exec();
  }

  async findById(id: string): Promise<any> {
    return this.userModel
      .findById(id)
      .select('+passwordHash')
      .exec();
  }

  async delete(id: string): Promise<any> {
    return this.userModel
      .findByIdAndDelete(id)
      .exec();
  }
}