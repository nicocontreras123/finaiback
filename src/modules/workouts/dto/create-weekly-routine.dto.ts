import { IsString, IsObject, IsOptional, IsBoolean } from 'class-validator';

export class CreateWeeklyRoutineDto {
  @IsString()
  weekStarting: string;

  @IsString()
  goal: string;

  @IsObject()
  days: {
    lunes?: {
      day: string;
      restDay: boolean;
      workout: any | null;
      notes: string;
    };
    martes?: {
      day: string;
      restDay: boolean;
      workout: any | null;
      notes: string;
    };
    miercoles?: {
      day: string;
      restDay: boolean;
      workout: any | null;
      notes: string;
    };
    jueves?: {
      day: string;
      restDay: boolean;
      workout: any | null;
      notes: string;
    };
    viernes?: {
      day: string;
      restDay: boolean;
      workout: any | null;
      notes: string;
    };
    sabado?: {
      day: string;
      restDay: boolean;
      workout: any | null;
      notes: string;
    };
    domingo?: {
      day: string;
      restDay: boolean;
      workout: any | null;
      notes: string;
    };
  };

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: {
    sports?: string[];
    level?: string;
    generatedBy?: string;
  };
}
