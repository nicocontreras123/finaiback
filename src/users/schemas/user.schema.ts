import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  supabaseId: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  weight: number;

  @Prop()
  height: number;

  @Prop()
  level: string;

  @Prop()
  gender: string;

  @Prop({ type: [String], default: [] })
  sports: string[];

  @Prop({ type: [String], default: [] })
  goals: string[];

  @Prop({ type: [String], default: [] })
  trainingDays: string[];

  @Prop({ type: [String], default: [] })
  equipment: string[];

  @Prop({ default: true })
  voiceEnabled: boolean;

  @Prop({ default: true })
  timerSoundEnabled: boolean;

  @Prop({ default: false })
  motivationalCoachingEnabled: boolean;

  @Prop({
    type: String,
    enum: ['spotify', 'youtube-music', 'apple-music', null],
    default: null
  })
  preferredMusicApp: string | null;

  @Prop({ default: 0 })
  prepTimeMinutes: number;

  @Prop({ default: 10 })
  prepTimeSeconds: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
