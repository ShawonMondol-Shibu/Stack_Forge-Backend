import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { db } from '../lib/database/db';
import { profile } from '../lib/database/schema/profile.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class ProfileService {
  async createProfile(CreateProfileDto: CreateProfileDto) {
    const existingProfile = await db
      .select()
      .from(profile)
      .where(eq(profile.userId, CreateProfileDto.userId))
      .limit(1);
    if (existingProfile.length > 0) {
      throw new NotAcceptableException('Profile alreay created.');
    }
    const res = await db.insert(profile).values(CreateProfileDto).returning();
    return res;
  }

  async getProfile(userId: string) {
    const profileData = await db
      .select()
      .from(profile)
      .where(eq(profile.userId, userId));

    if (profileData.length === 0) {
      throw new NotFoundException('please create a profile.');
    }

    return profileData[0];
  }

  async updateProfile(
    id: string,
    userId: string,
    UpdateProfileDto: UpdateProfileDto,
  ) {
    const res = await db
      .update(profile)
      .set(UpdateProfileDto)
      .where(and(eq(profile.id, id), eq(profile.userId, userId)));
    return res;
  }
}
