import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkoutsService } from './workouts.service';
import { WorkoutsController } from './workouts.controller';
import { Workout, WorkoutSchema } from './entities/workout.schema';
import { WeeklyRoutine, WeeklyRoutineSchema } from './entities/weekly-routine.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workout.name, schema: WorkoutSchema },
      { name: WeeklyRoutine.name, schema: WeeklyRoutineSchema },
    ]),
    AuthModule,
  ],
  controllers: [WorkoutsController],
  providers: [WorkoutsService],
  exports: [WorkoutsService],
})
export class WorkoutsModule {}
