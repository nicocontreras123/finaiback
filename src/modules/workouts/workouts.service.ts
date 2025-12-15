import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Workout, WorkoutDocument } from './entities/workout.schema';
import { WeeklyRoutine, WeeklyRoutineDocument } from './entities/weekly-routine.schema';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { CreateWeeklyRoutineDto } from './dto/create-weekly-routine.dto';
import { UpdateWeeklyRoutineDto } from './dto/update-weekly-routine.dto';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectModel(Workout.name) private workoutModel: Model<WorkoutDocument>,
    @InjectModel(WeeklyRoutine.name) private weeklyRoutineModel: Model<WeeklyRoutineDocument>,
  ) { }

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

  async getWeeklyStats(supabaseUserId: string) {
    // Obtener fecha de inicio de la semana (lunes)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Si es domingo, retrocede 6 días
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // Obtener workouts completados de esta semana
    const workouts = await this.workoutModel
      .find({
        supabaseUserId,
        isCompleted: true,
        completedAt: { $gte: startOfWeek },
      })
      .exec();

    // Calcular estadísticas
    let totalKm = 0;
    let totalRounds = 0;
    const dailyMinutes = [0, 0, 0, 0, 0, 0, 0]; // L, M, M, J, V, S, D

    workouts.forEach((workout) => {
      // Sumar kilómetros (de workouts de running)
      if (workout.distance) {
        totalKm += workout.distance;
      }

      // Sumar rounds (de workouts de boxeo)
      if (workout.data && workout.data.rounds) {
        totalRounds += workout.data.rounds;
      }

      // Actividad diaria
      if (workout.completedAt) {
        const workoutDay = new Date(workout.completedAt).getDay();
        const dayIndex = workoutDay === 0 ? 6 : workoutDay - 1; // Convertir domingo=0 a índice 6
        dailyMinutes[dayIndex] += workout.duration || 0;
      }
    });

    return {
      weeklyKm: parseFloat(totalKm.toFixed(1)),
      weeklyRounds: totalRounds,
      dailyActivity: dailyMinutes,
      totalWorkouts: workouts.length,
    };
  }

  // ==================== Weekly Routines ====================

  async createWeeklyRoutine(
    userId: string,
    createWeeklyRoutineDto: CreateWeeklyRoutineDto,
  ): Promise<WeeklyRoutine> {
    // Si la nueva rutina es activa, desactivar todas las demás
    if (createWeeklyRoutineDto.isActive) {
      await this.weeklyRoutineModel.updateMany(
        { userId, isActive: true },
        { isActive: false },
      );
    }

    const createdRoutine = new this.weeklyRoutineModel({
      ...createWeeklyRoutineDto,
      userId,
      supabaseUserId: userId, // Por ahora usamos el mismo ID para ambos campos
    });
    return createdRoutine.save();
  }

  async findAllWeeklyRoutines(userId: string): Promise<WeeklyRoutine[]> {
    return this.weeklyRoutineModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findActiveWeeklyRoutine(userId: string): Promise<WeeklyRoutine | null> {
    return this.weeklyRoutineModel
      .findOne({ userId, isActive: true })
      .exec();
  }

  async findWeeklyRoutineById(
    id: string,
    userId: string,
  ): Promise<WeeklyRoutine | null> {
    return this.weeklyRoutineModel.findOne({ _id: id, userId }).exec();
  }

  async updateWeeklyRoutine(
    id: string,
    userId: string,
    updateWeeklyRoutineDto: UpdateWeeklyRoutineDto,
  ): Promise<WeeklyRoutine | null> {
    // Si se está activando esta rutina, desactivar todas las demás
    if (updateWeeklyRoutineDto.isActive) {
      await this.weeklyRoutineModel.updateMany(
        { userId, isActive: true, _id: { $ne: id } },
        { isActive: false },
      );
    }

    return this.weeklyRoutineModel
      .findOneAndUpdate(
        { _id: id, userId },
        updateWeeklyRoutineDto,
        { new: true },
      )
      .exec();
  }

  async deleteWeeklyRoutine(
    id: string,
    userId: string,
  ): Promise<WeeklyRoutine | null> {
    return this.weeklyRoutineModel
      .findOneAndDelete({ _id: id, userId })
      .exec();
  }

  async setActiveWeeklyRoutine(
    id: string,
    userId: string,
  ): Promise<WeeklyRoutine | null> {
    // Desactivar todas las rutinas
    await this.weeklyRoutineModel.updateMany(
      { userId, isActive: true },
      { isActive: false },
    );

    // Activar la rutina seleccionada
    return this.weeklyRoutineModel
      .findOneAndUpdate(
        { _id: id, userId },
        { isActive: true },
        { new: true },
      )
      .exec();
  }
}
