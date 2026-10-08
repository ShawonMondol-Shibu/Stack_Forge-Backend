import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { user } from '../../lib/database/schema';

export const educationTypeEnum = pgEnum('education_type', [
  'degree',
  'diploma',
  'certificate',
  'bootcamp',
  'training',
  'other',
]);

export const educationStatusEnum = pgEnum('education_status', [
  'in_progress',
  'completed',
  'withdrawn',
  'discontinued',
]);

export const education = pgTable(
  'education',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    userId: text('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
      }),

    educationType: educationTypeEnum('education_type').notNull(),

    institutionName: text('institution_name').notNull(),

    institutionUrl: text('institution_url'),

    institutionLogoUrl: text('institution_logo_url'),

    location: text('location'),

    degree: text('degree').notNull(),

    fieldOfStudy: text('field_of_study'),

    startDate: date('start_date'),

    endDate: date('end_date'),

    isCurrent: boolean('is_current').default(false).notNull(),

    status: educationStatusEnum('status').notNull(),

    gradeValue: text('grade_value'),

    gradeScale: text('grade_scale'),

    description: text('description'),

    activities: text('activities'),

    isPublic: boolean('is_public').default(true).notNull(),

    displayOrder: integer('display_order').default(0).notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),

    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    userIdx: index('education_user_idx').on(table.userId),
  }),
);
