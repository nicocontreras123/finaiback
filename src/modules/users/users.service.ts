import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findBySupabaseId(supabaseId: string): Promise<User | null> {
    return this.userModel.findOne({ supabaseId }).exec();
  }

  async findOrCreate(userId: string, email: string): Promise<User> {
    let user = await this.findById(userId);

    if (!user) {
      user = await this.findByEmail(email);

      if (!user) {
        user = await this.create({ email });
      }
    }

    return user;
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(userId, updateUserDto, { new: true })
      .exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
