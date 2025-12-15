import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WeeklyRoutineDocument = WeeklyRoutine & Document;

@Schema({ timestamps: true })
export class WeeklyRoutine {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  supabaseUserId: string;

  @Prop({ required: true })
  weekStarting: string; // Fecha de inicio de la semana en formato YYYY-MM-DD

  @Prop({ required: true })
  goal: string; // Objetivo semanal

  @Prop({ type: Object, required: true })
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

  @Prop({ default: false })
  isActive: boolean; // Indica si es la rutina activa actual

  @Prop({ type: Object })
  metadata: {
    sports?: string[]; // Deportes incluidos
    level?: string; // Nivel del usuario
    generatedBy?: string; // 'ai' | 'manual'
  };
}

export const WeeklyRoutineSchema = SchemaFactory.createForClass(WeeklyRoutine);

// Índices para mejorar queries
WeeklyRoutineSchema.index({ supabaseUserId: 1, createdAt: -1 });
WeeklyRoutineSchema.index({ supabaseUserId: 1, isActive: 1 });
WeeklyRoutineSchema.index({ supabaseUserId: 1, weekStarting: 1 });
