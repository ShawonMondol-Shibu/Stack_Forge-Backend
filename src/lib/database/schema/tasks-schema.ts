import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { user } from './auth-schema';

export const priorityEnum = pgEnum('priorityEnum', ['high', 'medium', 'low']);
export const statusEnum = pgEnum('statusEnum', ['todo', 'in_progress', 'done']);

export const tasks = pgTable(
  'tasks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    title: varchar('title', { length: 100 }).notNull(),
    priority: priorityEnum().notNull().default('medium'),
    status: statusEnum().notNull().default('todo'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    userIdx: index('tasks_user_idx').on(table.userId),
    uniqueUserTasks: unique().on(table.userId, table.id),
  }),
);
