import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Workout, WorkoutDocument } from './schemas/workout.schema';
import {
  WorkoutCompleted,
  WorkoutCompletedDocument,
} from './schemas/workout-completed.schema';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { CreateWorkoutCompletedDto } from './dto/create-workout-completed.dto';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectModel(Workout.name) private workoutModel: Model<WorkoutDocument>,
    @InjectModel(WorkoutCompleted.name)
    private workoutCompletedModel: Model<WorkoutCompletedDocument>,
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

  // WorkoutCompleted methods
  async saveCompletedWorkout(
    dto: CreateWorkoutCompletedDto,
  ): Promise<WorkoutCompleted> {
    const completedWorkout = new this.workoutCompletedModel({
      ...dto,
      completedAt: new Date(dto.completedAt),
    });
    return completedWorkout.save();
  }

  async getWorkoutHistory(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    workouts: WorkoutCompleted[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [workouts, total] = await Promise.all([
      this.workoutCompletedModel
        .find({ userId })
        .sort({ completedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.workoutCompletedModel.countDocuments({ userId }).exec(),
    ]);

    return {
      workouts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getWorkoutStats(userId: string): Promise<{
    totalWorkouts: number;
    totalDuration: number;
    totalCalories: number;
    currentStreak: number;
    byType: {
      boxing: number;
      running: number;
      gym: number;
    };
    weeklyData: Array<{
      week: string;
      count: number;
      duration: number;
    }>;
  }> {
    const workouts = await this.workoutCompletedModel
      .find({ userId })
      .sort({ completedAt: -1 })
      .exec();

    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    const totalCalories = workouts.reduce(
      (sum, w) => sum + w.caloriesBurned,
      0,
    );

    // Calculate streak
    const currentStreak = this.calculateStreak(workouts);

    // By type
    const byType = {
      boxing: workouts.filter((w) => w.workoutType === 'boxing').length,
      running: workouts.filter((w) => w.workoutType === 'running').length,
      gym: workouts.filter((w) => w.workoutType === 'gym').length,
    };

    // Weekly data (last 4 weeks)
    const weeklyData = this.calculateWeeklyData(workouts);

    return {
      totalWorkouts,
      totalDuration,
      totalCalories,
      currentStreak,
      byType,
      weeklyData,
    };
  }

  private calculateStreak(workouts: WorkoutCompleted[]): number {
    if (workouts.length === 0) return 0;

    const sortedWorkouts = workouts.sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const workout of sortedWorkouts) {
      const workoutDate = new Date(workout.completedAt);
      workoutDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === streak || (streak === 0 && diffDays <= 1)) {
        streak++;
        currentDate = new Date(workoutDate);
      } else {
        break;
      }
    }

    return streak;
  }

  private calculateWeeklyData(
    workouts: WorkoutCompleted[],
  ): Array<{
    week: string;
    count: number;
    duration: number;
  }> {
    const now = new Date();
    const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

    const recentWorkouts = workouts.filter(
      (w) => new Date(w.completedAt) >= fourWeeksAgo,
    );

    const weeklyMap = new Map<string, { count: number; duration: number }>();

    recentWorkouts.forEach((workout) => {
      const date = new Date(workout.completedAt);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0];

      const existing = weeklyMap.get(weekKey) || { count: 0, duration: 0 };
      weeklyMap.set(weekKey, {
        count: existing.count + 1,
        duration: existing.duration + workout.duration,
      });
    });

    return Array.from(weeklyMap.entries())
      .map(([week, data]) => ({
        week,
        ...data,
      }))
      .sort((a, b) => a.week.localeCompare(b.week));
  }
}
