import { IsOptional, IsString, IsNumber, IsArray, IsBoolean, IsIn } from 'class-validator';

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
  @IsArray()
  sports?: string[];

  @IsOptional()
  @IsArray()
  goals?: string[];

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
  @IsBoolean()
  motivationalCoachingEnabled?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(['spotify', 'youtube-music', 'apple-music', null])
  preferredMusicApp?: string | null;

  @IsOptional()
  @IsNumber()
  prepTimeMinutes?: number;

  @IsOptional()
  @IsNumber()
  prepTimeSeconds?: number;
}
