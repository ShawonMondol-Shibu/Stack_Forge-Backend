import {
  boolean,
  date,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { profile } from '../../lib/database/schema';

export const experiences = pgTable(
  'experiences',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    profileId: uuid('profile_id')
      .notNull()
      .references(() => profile.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),

    company: text('company').notNull(),
    position: text('position').notNull(),
    description: text('description'),

    startDate: date('start_date').notNull(),
    endDate: date('end_date'),
    isCurrent: boolean('is_current').notNull().default(false),

    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    profileIdx: index('experience_profile_idx').on(table.profileId),
  }),
);
