import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  supabaseId?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

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
}
