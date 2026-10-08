import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { db } from '../lib/database/db';
import { education } from '../lib/database/schema';
import { and, asc, desc, eq } from 'drizzle-orm';

@Injectable()
export class EducationService {
  async createEducation(
    userId: string,
    createEducationDto: CreateEducationDto,
  ) {
    const [data] = await db
      .insert(education)
      .values({ ...createEducationDto, userId })
      .returning();
    return { message: 'Education created successfully.', data };
  }

  async myEducation(userId: string) {
    const data = await db
      .select()
      .from(education)
      .where(eq(education.userId, userId))
      .orderBy(asc(education.displayOrder), desc(education.startDate));
    return { message: 'Education retrieved successfully.', data };
  }

  async getUserEducation(userId: string) {
    const data = await db
      .select()
      .from(education)
      .where(and(eq(education.userId, userId), eq(education.isPublic, true)))
      .orderBy(asc(education.displayOrder), desc(education.startDate));
    return { message: 'Education retrieved successfully.', data };
  }

  async getOneEducation(id: string) {
    const [data] = await db
      .select()
      .from(education)
      .where(eq(education.id, id))
      .limit(1);
    if (!data) {
      throw new NotFoundException('Education not found.');
    }
    return { message: 'Education retrieved successfully.', data };
  }

  async updateEducation(
    id: string,
    userId: string,
    updateEducationDto: UpdateEducationDto,
  ) {
    const [data] = await db
      .update(education)
      .set(updateEducationDto)
      .where(and(eq(education.id, id), eq(education.userId, userId)))
      .returning();
    if (!data) {
      throw new NotFoundException('Education not found.');
    }
    return { message: 'Education successfully updated.', data };
  }

  async deleteEducation(id: string, userId: string) {
    const [data] = await db
      .delete(education)
      .where(and(eq(education.id, id), eq(education.userId, userId)))
      .returning();
    if (!data) {
      throw new NotFoundException('Education not found.');
    }
    return { message: 'Education successfully deleted.', data };
  }
}
