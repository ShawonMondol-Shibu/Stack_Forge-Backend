import {
  pgTable,
  uuid,
  timestamp,
  primaryKey,
  check,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm/_relations';

// Assume you already have a users table defined like this:
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  // other fields (username, email, etc.)
});

// Follows Join Table
export const follows = pgTable(
  'follows',
  {
    followerId: uuid('follower_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    followingId: uuid('following_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
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
export const usersRelations = relations(users, ({ many }) => ({
  // People who follow this user
  followers: many(follows, { relationName: 'user_followers' }),
  // People this user is following
  following: many(follows, { relationName: 'user_following' }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: 'user_following',
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
    relationName: 'user_followers',
  }),
}));
