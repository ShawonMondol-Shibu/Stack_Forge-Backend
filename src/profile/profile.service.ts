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
    const data = await db.insert(profile).values(CreateProfileDto).returning();
    return { message: 'Profile created successfully.', data };
  }

  async getMyProfile(userId: string) {
    const data = await db
      .select()
      .from(profile)
      .where(eq(profile.userId, userId));
    if (data.length === 0) {
      throw new NotFoundException('Profile not found.');
    }
    return { message: 'Profile get successfully', data };
  }

  async getAllProfile() {
    const data = await db.select().from(profile);

    if (data.length === 0) {
      throw new NotFoundException('please create a profile.');
    }

    return { message: 'Profiles get successfully', data };
  }

  async getProfileById(id: string) {
    const data = await db.select().from(profile).where(eq(profile.id, id));
    if (data.length === 0) {
      throw new NotFoundException('Profile not found.');
    }
    return { message: 'Profile get successfully', data };
  }

  async updateProfile(
    id: string,
    userId: string,
    UpdateProfileDto: UpdateProfileDto,
  ) {
    const data = await db
      .update(profile)
      .set(UpdateProfileDto)
      .where(and(eq(profile.id, id), eq(profile.userId, userId)));
    return { message: 'Profile updated successfully.', data };
  }
}
