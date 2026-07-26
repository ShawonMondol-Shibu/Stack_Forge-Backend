import {
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { user } from './auth-schema';

export const skill = pgTable('skill', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onUpdate: 'cascade' }),
  name: varchar({ length: 50 }),
  level: smallint(),
  yearsExperience: smallint('years_experience'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
