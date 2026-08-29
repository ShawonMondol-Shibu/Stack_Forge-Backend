ALTER TABLE "techStack" DROP CONSTRAINT "techStack_user_id_unique";--> statement-breakpoint
ALTER TABLE "techStack" ADD CONSTRAINT "techStack_user_id_id_unique" UNIQUE("user_id","id");