import { index, timestamp, unique, varchar } from 'drizzle-orm/pg-core';
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from '../../lib/database/schema';

export const projects = pgTable(
  'projects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onUpdate: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    techStack: text('techStack')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    image: text('image'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    userIdx: index('project_user_idx').on(table.userId),
    uniqueUserProject: unique().on(table.userId, table.name),
  }),
);
