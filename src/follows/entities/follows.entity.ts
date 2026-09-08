import {
  pgTable,
  timestamp,
  primaryKey,
  check,
  index,
  text,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm/_relations';
import { user } from '../../lib/database/schema';

// Follows Join Table
export const follows = pgTable(
  'follows',
  {
    followerId: text('follower_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    followingId: text('following_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // Composite Primary Key: Prevents duplicate follow entries
    primaryKey({ columns: [table.followerId, table.followingId] }),

    // Index for retrieving a user's followers efficiently
    index('idx_follows_following_id').on(table.followingId),

    // Index for retrieving a user's following list ordered by latest
    index('idx_follows_follower_created').on(table.followerId, table.createdAt),

    // Database-level constraint: Prevents users from following themselves
    check(
      'prevent_self_follow',
      sql`${table.followerId} <> ${table.followingId}`,
    ),
  ],
);

// Drizzle Relations Configuration
export const usersRelations = relations(user, ({ many }) => ({
  // People who follow this user
  followers: many(follows, { relationName: 'user_followers' }),
  // People this user is following
  following: many(follows, { relationName: 'user_following' }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(user, {
    fields: [follows.followerId],
    references: [user.id],
    relationName: 'user_following',
  }),
  following: one(user, {
    fields: [follows.followingId],
    references: [user.id],
    relationName: 'user_followers',
  }),
}));
