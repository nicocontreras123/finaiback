import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsObject,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class WorkoutDataDto {
  @IsString()
  title: string;

  @IsEnum(['beginner', 'intermediate', 'advanced'])
  difficulty: string;

  @IsOptional()
  @IsNumber()
  rounds?: number;

  @IsOptional()
  @IsNumber()
  roundDuration?: number;

  @IsOptional()
  @IsNumber()
  restDuration?: number;

  @IsOptional()
  @IsNumber()
  distance?: number;

  @IsOptional()
  @IsObject()
  intervals?: Array<{
    type: string;
    duration: number;
    pace?: string;
  }>;

  @IsOptional()
  @IsObject()
  exercises?: Array<{
    name: string;
    sets: number;
    reps: number;
    weight?: string;
  }>;

  @IsOptional()
  @IsNumber()
  totalDuration?: number;
}

export class CreateWorkoutCompletedDto {
  @IsString()
  userId: string;

  @IsEnum(['boxing', 'running', 'gym'])
  workoutType: string;

  @IsDateString()
  completedAt: string;

  @IsNumber()
  duration: number;

  @IsNumber()
  caloriesBurned: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @ValidateNested()
  @Type(() => WorkoutDataDto)
  workoutData: WorkoutDataDto;
}
