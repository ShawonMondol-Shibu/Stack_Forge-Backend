import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { db } from '../lib/database/db';
import { tasks } from '../lib/database/schema';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class TasksService {
  async create(createTaskDto: CreateTaskDto, userId: string) {
    const [data] = await db
      .insert(tasks)
      .values({ userId, ...createTaskDto })
      .returning();
    return { message: '', data };
  }

  async findAll(userId: string) {
    const data = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .limit(1);
    return { message: 'tasks retrieved successfully.', data };
  }

  async findOne(id: string, userId: string) {
    const [data] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .limit(1);
    return { message: 'task retrieved successfully.', data };
  }

  async update(id: string, userId: string, updateTaskDto: UpdateTaskDto) {
    const [data] = await db
      .update(tasks)
      .set(updateTaskDto)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    return { message: 'task updated successfully.', data };
  }

  async remove(id: string, userId: string) {
    const [data] = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    return { message: 'task deleted successfully.', data };
  }
}
