ALTER TABLE "techStack" ADD CONSTRAINT "techStack_user_id_unique" UNIQUE("user_id");--> statement-breakpoint
CREATE INDEX "techStack_user_idx" ON "techStack" ("user_id");