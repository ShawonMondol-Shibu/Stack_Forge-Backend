import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './auth-schema';

export const availability = pgEnum('availability', [
  'open',
  'busy',
  'unavailable',
]);

export const profile = pgTable('profile', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  fullName: text('full_name').notNull(),
  headline: text('headline'),
  bio: text('bio'),
  location: text('location'),
  website: text('website'),
  avatarUrl: text('avatar_url'),
  coverUrl: text('cover_url'),
  availability: availability().default('open'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
