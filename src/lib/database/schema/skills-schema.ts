import {
  uuid,
  text,
  varchar,
  smallint,
  timestamp,
  index,
  unique,
  pgTable,
} from 'drizzle-orm/pg-core';

import { user } from './auth-schema';

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

    name: varchar('name', { length: 100 }).notNull(),

    level: smallint('level').notNull(),

    yearsExperience: smallint('years_experience').default(0).notNull(),

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

    uniqueUserSkill: unique().on(table.userId, table.name),
  }),
);
