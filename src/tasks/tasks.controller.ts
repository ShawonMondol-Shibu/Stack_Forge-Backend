import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Session() session: UserSession,
  ) {
    return this.tasksService.create(createTaskDto, session.user.id);
  }

  @Get()
  findAll(@Session() session: UserSession) {
    return this.tasksService.findAll(session.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Session() session: UserSession) {
    return this.tasksService.findOne(id, session.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Session() session: UserSession,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, session.user.id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Session() session: UserSession) {
    return this.tasksService.remove(id, session.user.id);
  }
}
