import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { db } from '../lib/database/db';
import { experiences, profile } from '../lib/database/schema';
import { and, desc, eq } from 'drizzle-orm';

@Injectable()
export class ExperiencesService {
  private async getMyProfileId(userId: string) {
    const [userProfile] = await db
      .select({ id: profile.id })
      .from(profile)
      .where(eq(profile.userId, userId))
      .limit(1);
    if (!userProfile) {
      throw new NotFoundException('Profile not found. Create a profile first.');
    }
    return userProfile.id;
  }

  async createExperience(
    userId: string,
    createExperienceDto: CreateExperienceDto,
  ) {
    const profileId = await this.getMyProfileId(userId);
    const [data] = await db
      .insert(experiences)
      .values({ ...createExperienceDto, profileId })
      .returning();
    return { message: 'Experience created successfully.', data };
  }

  async myExperiences(userId: string) {
    const profileId = await this.getMyProfileId(userId);
    const data = await db
      .select()
      .from(experiences)
      .where(eq(experiences.profileId, profileId))
      .orderBy(desc(experiences.startDate));
    return { message: 'Experiences retrieved successfully.', data };
  }

  async getProfileExperiences(profileId: string) {
    const data = await db
      .select()
      .from(experiences)
      .where(eq(experiences.profileId, profileId))
      .orderBy(desc(experiences.startDate));
    return { message: 'Experiences retrieved successfully.', data };
  }

  async updateExperience(
    id: string,
    userId: string,
    updateExperienceDto: UpdateExperienceDto,
  ) {
    const profileId = await this.getMyProfileId(userId);
    const [data] = await db
      .update(experiences)
      .set(updateExperienceDto)
      .where(and(eq(experiences.id, id), eq(experiences.profileId, profileId)))
      .returning();
    if (!data) {
      throw new NotFoundException('Experience not found.');
    }
    return { message: 'Experience successfully updated.', data };
  }

  async deleteExperience(id: string, userId: string) {
    const profileId = await this.getMyProfileId(userId);
    const [data] = await db
      .delete(experiences)
      .where(and(eq(experiences.id, id), eq(experiences.profileId, profileId)))
      .returning();
    if (!data) {
      throw new NotFoundException('Experience not found.');
    }
    return { message: 'Experience successfully deleted.', data };
  }
}
