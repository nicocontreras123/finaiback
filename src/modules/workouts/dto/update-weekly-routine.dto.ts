import { PartialType } from '@nestjs/mapped-types';
import { CreateWeeklyRoutineDto } from './create-weekly-routine.dto';

export class UpdateWeeklyRoutineDto extends PartialType(CreateWeeklyRoutineDto) {}
