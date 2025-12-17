import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WorkoutCompletedDocument = WorkoutCompleted & Document;

@Schema({ timestamps: true })
export class WorkoutCompleted {
  @Prop({ required: true })
  userId: string; // Supabase UID

  @Prop({ required: true, enum: ['boxing', 'running', 'gym'] })
  workoutType: string;

  @Prop({ required: true })
  completedAt: Date;

  @Prop({ required: true })
  duration: number; // seconds

  @Prop({ required: true })
  caloriesBurned: number;

  @Prop()
  notes: string;

  @Prop({ type: Object, required: true })
  workoutData: {
    title: string;
    difficulty: string;
    rounds?: number;
    roundDuration?: number;
    restDuration?: number;
    distance?: number;
    intervals?: Array<{
      type: string;
      duration: number;
      pace?: string;
    }>;
    exercises?: Array<{
      name: string;
      sets: number;
      reps: number;
      weight?: string;
    }>;
    totalDuration?: number;
  };
}

export const WorkoutCompletedSchema =
  SchemaFactory.createForClass(WorkoutCompleted);

// Indexes for efficient queries
WorkoutCompletedSchema.index({ userId: 1, completedAt: -1 });
WorkoutCompletedSchema.index({ userId: 1, workoutType: 1 });
