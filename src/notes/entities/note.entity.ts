import { index, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { user } from '../../lib/database/schema';

export const notes = pgTable(
  'notes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    title: text('title').notNull(),
    content: text('content'),
    tag: text('tag').array(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    userIdx: index('user_notes_idx').on(table.userId),
    userNoteIdx: unique('user_note_idx').on(table.userId, table.id),
  }),
);
