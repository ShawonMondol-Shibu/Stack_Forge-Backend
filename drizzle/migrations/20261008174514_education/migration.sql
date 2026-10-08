CREATE TYPE "education_status" AS ENUM('in_progress', 'completed', 'withdrawn', 'discontinued');--> statement-breakpoint
CREATE TYPE "education_type" AS ENUM('degree', 'diploma', 'certificate', 'bootcamp', 'training', 'other');--> statement-breakpoint
CREATE TABLE "education" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"education_type" "education_type" NOT NULL,
	"institution_name" text NOT NULL,
	"institution_url" text,
	"institution_logo_url" text,
	"location" text,
	"degree" text NOT NULL,
	"field_of_study" text,
	"start_date" date,
	"end_date" date,
	"is_current" boolean DEFAULT false NOT NULL,
	"status" "education_status" NOT NULL,
	"grade_value" text,
	"grade_scale" text,
	"description" text,
	"activities" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "education_user_idx" ON "education" ("user_id");--> statement-breakpoint
ALTER TABLE "education" ADD CONSTRAINT "education_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;