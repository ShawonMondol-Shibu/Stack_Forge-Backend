import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { db } from '../lib/database/db';
import { follows, user } from '../lib/database/schema';
import { and, desc, eq } from 'drizzle-orm';

@Injectable()
export class FollowsService {
  async follow(followerId: string, createFollowDto: CreateFollowDto) {
    const { followingId } = createFollowDto;
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself.');
    }

    const [targetUser] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, followingId))
      .limit(1);
    if (!targetUser) {
      throw new NotFoundException('User to follow not found.');
    }

    const [data] = await db
      .insert(follows)
      .values({ followerId, followingId })
      .onConflictDoNothing()
      .returning();
    if (!data) {
      throw new ConflictException('You are already following this user.');
    }

    return { message: 'User followed successfully.', data };
  }

  async getFollowing(userId: string) {
    const data = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
        followedAt: follows.createdAt,
      })
      .from(follows)
      .innerJoin(user, eq(follows.followingId, user.id))
      .where(eq(follows.followerId, userId))
      .orderBy(desc(follows.createdAt));
    return { message: 'Following retrieved successfully.', data };
  }

  async getFollowers(userId: string) {
    const data = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
        followedAt: follows.createdAt,
      })
      .from(follows)
      .innerJoin(user, eq(follows.followerId, user.id))
      .where(eq(follows.followingId, userId))
      .orderBy(desc(follows.createdAt));
    return { message: 'Followers retrieved successfully.', data };
  }

  async unfollow(followerId: string, followingId: string) {
    const [data] = await db
      .delete(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.followingId, followingId),
        ),
      )
      .returning();
    if (!data) {
      throw new NotFoundException('Follow relationship not found.');
    }
    return { message: 'User unfollowed successfully.', data };
  }
}
