import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSkillsDto } from './dto/create-skills.dto';
import { db } from '../lib/database/db';
import { skill } from '../lib/database/schema/skills-schema';
import { and, eq } from 'drizzle-orm';
import { UpdateSkillsDto } from './dto/update-skills.dto';

@Injectable()
export class SkillsService {
  async createSkills(createSkillsDto: CreateSkillsDto) {
    const isExistSkill = await db
      .select()
      .from(skill)
      .where(
        and(
          eq(skill.userId, createSkillsDto.userId),
          eq(skill.name, createSkillsDto.name),
        ),
      )
      .limit(1);

    if (isExistSkill.length) {
      throw new NotAcceptableException('Create new Skills.');
    }
    const result = await db.insert(skill).values(createSkillsDto).returning();
    return result;
  }

  async allSkills(userId: string) {
    const result = await db
      .select()
      .from(skill)
      .where(eq(skill.userId, userId));

    if (result.length === 0) {
      throw new NotFoundException(
        "There's no skills. please add your skill's first.",
      );
    }
    return result;
  }

  async updateSkills(
    id: string,
    userId: string,
    updateSkillsDto: UpdateSkillsDto,
  ) {
    const result = await db
      .update(skill)
      .set(updateSkillsDto)
      .where(and(eq(skill.id, id), eq(skill.userId, userId)))
      .returning();
    return result;
  }

  async deleteSkills(id: string, userId: string) {
    const result = await db
      .delete(skill)
      .where(and(eq(skill.id, id), eq(skill.userId, userId)))
      .returning();

    return { message: '', data: result };
  }
}
