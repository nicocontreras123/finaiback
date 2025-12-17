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
  Patch,
} from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { CreateWeeklyRoutineDto } from './dto/create-weekly-routine.dto';
import { UpdateWeeklyRoutineDto } from './dto/update-weekly-routine.dto';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

@Controller('workout-templates')
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

  @Get('stats/weekly')
  async getWeeklyStats(@CurrentUser() user: any) {
    return this.workoutsService.getWeeklyStats(user.id);
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

  // ==================== Weekly Routines Endpoints ====================

  @Post('weekly-routines')
  async createWeeklyRoutine(
    @CurrentUser() user: any,
    @Body() createWeeklyRoutineDto: CreateWeeklyRoutineDto,
  ) {
    console.log('📅 Creating weekly routine for user:', user.id);
    console.log('📅 Routine data:', JSON.stringify(createWeeklyRoutineDto, null, 2));
    return this.workoutsService.createWeeklyRoutine(user.id, createWeeklyRoutineDto);
  }

  @Get('weekly-routines')
  async findAllWeeklyRoutines(@CurrentUser() user: any) {
    return this.workoutsService.findAllWeeklyRoutines(user.id);
  }

  @Get('weekly-routines/active')
  async findActiveWeeklyRoutine(@CurrentUser() user: any) {
    return this.workoutsService.findActiveWeeklyRoutine(user.id);
  }

  @Get('weekly-routines/:id')
  async findWeeklyRoutineById(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    return this.workoutsService.findWeeklyRoutineById(id, user.id);
  }

  @Put('weekly-routines/:id')
  async updateWeeklyRoutine(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateWeeklyRoutineDto: UpdateWeeklyRoutineDto,
  ) {
    return this.workoutsService.updateWeeklyRoutine(
      id,
      user.id,
      updateWeeklyRoutineDto,
    );
  }

  @Delete('weekly-routines/:id')
  async deleteWeeklyRoutine(@CurrentUser() user: any, @Param('id') id: string) {
    return this.workoutsService.deleteWeeklyRoutine(id, user.id);
  }

  @Patch('weekly-routines/:id/set-active')
  async setActiveWeeklyRoutine(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    return this.workoutsService.setActiveWeeklyRoutine(id, user.id);
  }
}
