ALTER TABLE "skill" DROP CONSTRAINT "skill_user_id_name_unique";--> statement-breakpoint
ALTER TABLE "skill" ADD COLUMN "techStack" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "skill" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "skill" DROP COLUMN "level";--> statement-breakpoint
ALTER TABLE "skill" DROP COLUMN "years_experience";--> statement-breakpoint
ALTER TABLE "skill" ADD CONSTRAINT "skill_user_id_id_unique" UNIQUE("user_id","id");