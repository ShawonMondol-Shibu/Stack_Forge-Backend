import {
  uuid,
  text,
  timestamp,
  index,
  unique,
  pgTable,
} from 'drizzle-orm/pg-core';

import { user } from './auth-schema';
import { sql } from 'drizzle-orm';

export const skill = pgTable(
  'skill',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    userId: text('user_id')
      .notNull()
      .references(() => user.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),

    techStack: text('techStack')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp('updated_at', {
      withTimezone: true,
    })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    userIdx: index('skill_user_idx').on(table.userId),

    uniqueUserSkill: unique().on(table.userId, table.id),
  }),
);
