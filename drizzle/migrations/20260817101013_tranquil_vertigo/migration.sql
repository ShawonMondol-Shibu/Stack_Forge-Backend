CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"techStack" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_user_id_name_unique" UNIQUE("user_id","name")
);
--> statement-breakpoint
CREATE INDEX "project_user_idx" ON "projects" ("user_id");--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON UPDATE CASCADE;