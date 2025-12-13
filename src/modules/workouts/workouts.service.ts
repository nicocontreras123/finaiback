import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Workout, WorkoutDocument } from './entities/workout.schema';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectModel(Workout.name) private workoutModel: Model<WorkoutDocument>,
  ) {}

  async create(
    supabaseUserId: string,
    createWorkoutDto: CreateWorkoutDto,
  ): Promise<Workout> {
    const createdWorkout = new this.workoutModel({
      ...createWorkoutDto,
      supabaseUserId,
    });
    return createdWorkout.save();
  }

  async findAll(supabaseUserId: string): Promise<Workout[]> {
    return this.workoutModel
      .find({ supabaseUserId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, supabaseUserId: string): Promise<Workout | null> {
    return this.workoutModel.findOne({ _id: id, supabaseUserId }).exec();
  }

  async update(
    id: string,
    supabaseUserId: string,
    updateWorkoutDto: UpdateWorkoutDto,
  ): Promise<Workout | null> {
    return this.workoutModel
      .findOneAndUpdate({ _id: id, supabaseUserId }, updateWorkoutDto, {
        new: true,
      })
      .exec();
  }

  async remove(id: string, supabaseUserId: string): Promise<Workout | null> {
    return this.workoutModel.findOneAndDelete({ _id: id, supabaseUserId }).exec();
  }

  async findByType(supabaseUserId: string, type: string): Promise<Workout[]> {
    return this.workoutModel
      .find({ supabaseUserId, type })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findCompleted(supabaseUserId: string): Promise<Workout[]> {
    return this.workoutModel
      .find({ supabaseUserId, isCompleted: true })
      .sort({ completedAt: -1 })
      .exec();
  }
}
