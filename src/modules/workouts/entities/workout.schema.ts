import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WorkoutDocument = Workout & Document;

@Schema({ timestamps: true })
export class Workout {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  supabaseUserId: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Object })
  data: Record<string, any>;

  @Prop({ type: Date })
  completedAt: Date;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop()
  duration: number;

  @Prop()
  distance: number;

  @Prop()
  calories: number;

  @Prop({ type: [Object], default: [] })
  exercises: Array<{
    name: string;
    sets?: number;
    reps?: number;
    duration?: number;
    rest?: number;
    notes?: string;
  }>;
}

export const WorkoutSchema = SchemaFactory.createForClass(Workout);

WorkoutSchema.index({ supabaseUserId: 1, createdAt: -1 });
