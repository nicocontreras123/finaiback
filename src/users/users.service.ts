import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findBySupabaseId(supabaseId: string): Promise<User | null> {
    return this.userModel.findOne({ supabaseId }).exec();
  }

  async findOrCreate(supabaseId: string, email: string): Promise<User> {
    let user = await this.findBySupabaseId(supabaseId);

    if (!user) {
      user = await this.create({ supabaseId, email });
    }

    return user;
  }

  async update(supabaseId: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel
      .findOneAndUpdate({ supabaseId }, updateUserDto, { new: true })
      .exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
