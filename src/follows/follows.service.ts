import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { db } from '../lib/database/db';
import { follows, user } from '../lib/database/schema';
import { and, count, desc, eq, inArray } from 'drizzle-orm';

export type FollowCounts = {
  followersCount: number;
  followingCount: number;
};

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

  /**
   * Onek user er followers/following count ek-shathe (2 ta query, user songkha jai hok).
   * Profile list er response e merge korar jonno:
   *   const counts = await this.followsService.getCounts(userIds);
   *   profiles.map(p => ({ ...p, ...counts[p.userId] }))
   */
  async getCounts(userIds: string[]): Promise<Record<string, FollowCounts>> {
    const result: Record<string, FollowCounts> = {};
    if (userIds.length === 0) return result;

    for (const id of userIds) {
      result[id] = { followersCount: 0, followingCount: 0 };
    }

    const [followers, following] = await Promise.all([
      db
        .select({ userId: follows.followingId, total: count() })
        .from(follows)
        .where(inArray(follows.followingId, userIds))
        .groupBy(follows.followingId),
      db
        .select({ userId: follows.followerId, total: count() })
        .from(follows)
        .where(inArray(follows.followerId, userIds))
        .groupBy(follows.followerId),
    ]);

    for (const row of followers) result[row.userId].followersCount = row.total;
    for (const row of following) result[row.userId].followingCount = row.total;

    return result;
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
