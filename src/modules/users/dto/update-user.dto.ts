import { IsOptional, IsString, IsNumber, IsArray, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  sports?: string | string[];

  @IsOptional()
  sport?: string;

  @IsOptional()
  deportes?: string[];

  @IsOptional()
  goals?: string | string[];

  @IsOptional()
  availableDays?: string[];

  @IsOptional()
  @IsArray()
  trainingDays?: string[];

  @IsOptional()
  @IsArray()
  equipment?: string[];

  @IsOptional()
  @IsBoolean()
  voiceEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  timerSoundEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  prepTimeMinutes?: number;

  @IsOptional()
  @IsNumber()
  prepTimeSeconds?: number;

  @IsOptional()
  @IsBoolean()
  hasCompletedOnboarding?: boolean;

  @IsOptional()
  @IsNumber()
  trainingDaysPerWeek?: number;
}
