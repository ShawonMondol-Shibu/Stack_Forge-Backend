import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSkillsDto } from './dto/create-skills.dto';
import { db } from '../lib/database/db';
import { skill } from '../lib/database/schema/skills-schema';
import { and, eq } from 'drizzle-orm';
import { UpdateSkillsDto } from './dto/update-skills.dto';

@Injectable()
export class SkillsService {
  async createSkills(createSkillsDto: CreateSkillsDto, userId: string) {
    try {
      const [data] = await db
        .insert(skill)
        .values({ ...createSkillsDto, userId })
        .returning();
      return { message: 'successfully created.', data };
    } catch (error: unknown) {
      const err = error as { code?: string };
      const DUPLICATE_KEY_CODE = '23505';
      if (err?.code === DUPLICATE_KEY_CODE) {
        throw new ConflictException(`Skill is already taken.`);
      }

      throw error;
    }
  }

  async allSkills(userId: string) {
    const data = await db.select().from(skill).where(eq(skill.userId, userId));
    return { message: 'all skills get successfully.', data };
  }

  async getOneSkill(id: string, userId: string) {
    const [data] = await db
      .select()
      .from(skill)
      .where(and(eq(skill.id, id), eq(skill.userId, userId)))
      .limit(1);
    if (!data) {
      throw new NotFoundException('Skill not found.');
    }
    return { message: 'Skill retrieved successfully.', data };
  }

  async updateSkills(
    id: string,
    userId: string,
    updateSkillsDto: UpdateSkillsDto,
  ) {
    const [data] = await db
      .update(skill)
      .set(updateSkillsDto)
      .where(and(eq(skill.id, id), eq(skill.userId, userId)))
      .returning();

    if (!data) {
      throw new NotFoundException('Skill not found.');
    }
    return { message: 'Skill successfully updated.', data };
  }

  async deleteSkills(id: string, userId: string) {
    const [data] = await db
      .delete(skill)
      .where(and(eq(skill.id, id), eq(skill.userId, userId)))
      .returning();

    if (!data) {
      throw new NotFoundException('Skill not found.');
    }

    return { message: 'successfully deleted.', data };
  }
}
