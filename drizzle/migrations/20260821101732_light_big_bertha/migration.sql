CREATE TYPE "priorityEnum" AS ENUM('high', 'medium', 'low');--> statement-breakpoint
CREATE TYPE "statusEnum" AS ENUM('default', 'progress', 'done');--> statement-breakpoint
CREATE TABLE "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"title" varchar(100) NOT NULL,
	"priority" "priorityEnum" DEFAULT 'high'::"priorityEnum",
	"status" "statusEnum" DEFAULT 'default'::"statusEnum",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;