import { IsNotEmpty, IsString, IsOptional, IsObject, IsArray, IsBoolean, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWorkoutDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @IsOptional()
  @IsArray()
  exercises?: Array<{
    name: string;
    sets?: number;
    reps?: number;
    duration?: number;
    rest?: number;
    notes?: string;
  }>;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  completedAt?: Date;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsNumber()
  distance?: number;

  @IsOptional()
  @IsNumber()
  calories?: number;
}
