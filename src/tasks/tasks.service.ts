import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { db } from '../lib/database/db';
import { tasks } from '../lib/database/schema';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class TasksService {
  async create(createTaskDto: CreateTaskDto, userId: string) {
    try {
      const [data] = await db
        .insert(tasks)
        .values({ userId, ...createTaskDto })
        .returning();
      return { message: 'Task created successfully', data };
    } catch (error: unknown) {
      if (error instanceof Error) throw new Error(error.message);
      throw new Error();
    }
  }

  async findAll(userId: string) {
    const data = await db.select().from(tasks).where(eq(tasks.userId, userId));
    if (!data) throw new NotFoundException('No tasks found.');
    return { message: 'tasks retrieved successfully.', data };
  }

  async findOne(id: string, userId: string) {
    const [data] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .limit(1);
    if (!data) throw new NotFoundException('No task found.');
    return { message: 'task retrieved successfully.', data };
  }

  async update(id: string, userId: string, updateTaskDto: UpdateTaskDto) {
    const [data] = await db
      .update(tasks)
      .set(updateTaskDto)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    if (!data) throw new NotFoundException('No task found.');
    return { message: 'task updated successfully.', data };
  }

  async remove(id: string, userId: string) {
    const [data] = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();
    if (!data) throw new NotFoundException('No task found.');
    return { message: 'task deleted successfully.', data };
  }
}
