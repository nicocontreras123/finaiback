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
    // Normalizar datos: mapear campos con nombres diferentes al estándar
    const normalizedData: any = { ...updateUserDto };

    // Normalizar sports: sport/deportes → sports
    if (updateUserDto.sport && !updateUserDto.sports) {
      normalizedData.sports = [updateUserDto.sport];
      delete normalizedData.sport;
    } else if (updateUserDto.deportes && !updateUserDto.sports) {
      normalizedData.sports = updateUserDto.deportes;
      delete normalizedData.deportes;
    } else if (updateUserDto.sports) {
      normalizedData.sports = Array.isArray(updateUserDto.sports)
        ? updateUserDto.sports
        : [updateUserDto.sports];
      delete normalizedData.sport;
      delete normalizedData.deportes;
    }

    // Normalizar trainingDays: availableDays/available_days → trainingDays
    if (updateUserDto.availableDays && !updateUserDto.trainingDays) {
      normalizedData.trainingDays = updateUserDto.availableDays;
      delete normalizedData.availableDays;
    } else if ((updateUserDto as any).available_days && !updateUserDto.trainingDays) {
      normalizedData.trainingDays = (updateUserDto as any).available_days;
      delete (normalizedData as any).available_days;
    }

    // Normalizar level: fitness_level → level
    if ((updateUserDto as any).fitness_level && !updateUserDto.level) {
      normalizedData.level = (updateUserDto as any).fitness_level;
      delete (normalizedData as any).fitness_level;
    }

    // Normalizar goals: asegurar que sea array
    if (updateUserDto.goals && !Array.isArray(updateUserDto.goals)) {
      normalizedData.goals = [updateUserDto.goals];
    }

    // Eliminar campos que no existen en el schema
    delete normalizedData.sport;
    delete normalizedData.deportes;
    delete normalizedData.availableDays;
    delete (normalizedData as any).available_days;
    delete (normalizedData as any).fitness_level;
    delete normalizedData.trainingDaysPerWeek;
    delete (normalizedData as any).weekly_frequency;

    console.log('📝 Normalized data for update:', normalizedData);

    return this.userModel
      .findByIdAndUpdate(userId, normalizedData, { new: true })
      .exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
