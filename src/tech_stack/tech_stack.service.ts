import { Injectable } from '@nestjs/common';
import { CreateTechStackDto } from './dto/create-tech_stack.dto';
import { UpdateTechStackDto } from './dto/update-tech_stack.dto';
import { db } from '../lib/database/db';
import { techStack } from '../lib/database/schema';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class TechStackService {
  async create(createTechStackDto: CreateTechStackDto, userId: string) {
    const [data] = await db
      .insert(techStack)
      .values({ ...createTechStackDto, userId })
      .returning();
    return { message: 'Tech Stack created successfully.', data };
  }

  async findAll() {
    const data = await db.select().from(techStack);
    return { message: 'Tech Stack retrieved successfully.', data };
  }

  async findOne(id: string) {
    const [data] = await db
      .select()
      .from(techStack)
      .where(eq(techStack.id, id))
      .limit(1);
    return { message: 'Tech Stack retrieved successfully.', data };
  }

  async update(
    id: string,
    userId: string,
    updateTechStackDto: UpdateTechStackDto,
  ) {
    const [data] = await db
      .update(techStack)
      .set(updateTechStackDto)
      .where(and(eq(techStack.id, id), eq(techStack.userId, userId)))
      .returning();
    return { message: 'Tech Stack updated successfully.', data };
  }

  async remove(id: string, userId: string) {
    const [data] = await db
      .delete(techStack)
      .where(and(eq(techStack.id, id), eq(techStack.userId, userId)))
      .returning();
    return { message: 'Tech Stack removed successfully.', data };
  }
}
