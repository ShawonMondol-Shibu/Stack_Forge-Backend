ALTER TABLE "notes" RENAME TO "tasks";--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
DROP TYPE "statusEnum";--> statement-breakpoint
CREATE TYPE "statusEnum" AS ENUM('todo', 'in_progress', 'done');--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "status" SET DATA TYPE "statusEnum" USING "status"::"statusEnum";--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'todo'::"statusEnum";--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "priority" SET DEFAULT 'medium'::"priorityEnum";--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "priority" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_id_unique" UNIQUE("user_id","id");--> statement-breakpoint
CREATE INDEX "tasks_user_idx" ON "tasks" ("user_id");