import {
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { projects, user } from '../../lib/database/schema';

// Trending er signal: ke kon project like korechhe, ar kokhon
export const projectLikes = pgTable(
  'project_likes',
  {
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // Ek user ek project ek-bar-i like korte pare
    primaryKey({ columns: [table.projectId, table.userId] }),
    // "Gato 7 diner like" query er jonno
    index('project_likes_created_idx').on(table.createdAt, table.projectId),
  ],
);
