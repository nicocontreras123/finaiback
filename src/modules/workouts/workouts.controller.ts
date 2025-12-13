import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@Controller('workouts')
@UseGuards(AuthGuard)
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  async create(
    @CurrentUser() user: any,
    @Body() createWorkoutDto: CreateWorkoutDto,
  ) {
    return this.workoutsService.create(user.id, createWorkoutDto);
  }

  @Get()
  async findAll(@CurrentUser() user: any, @Query('type') type?: string) {
    if (type) {
      return this.workoutsService.findByType(user.id, type);
    }
    return this.workoutsService.findAll(user.id);
  }

  @Get('completed')
  async findCompleted(@CurrentUser() user: any) {
    return this.workoutsService.findCompleted(user.id);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.workoutsService.findOne(id, user.id);
  }

  @Put(':id')
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateWorkoutDto: UpdateWorkoutDto,
  ) {
    return this.workoutsService.update(id, user.id, updateWorkoutDto);
  }

  @Delete(':id')
  async remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.workoutsService.remove(id, user.id);
  }
}
