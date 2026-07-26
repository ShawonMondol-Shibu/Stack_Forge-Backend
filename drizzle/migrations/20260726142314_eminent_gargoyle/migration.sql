CREATE TABLE "skill" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"name" varchar(100) NOT NULL UNIQUE,
	"level" smallint NOT NULL,
	"years_experience" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skill_user_id_name_unique" UNIQUE("user_id","name")
);
--> statement-breakpoint
CREATE INDEX "skill_user_idx" ON "skill" ("user_id");--> statement-breakpoint
ALTER TABLE "skill" ADD CONSTRAINT "skill_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;