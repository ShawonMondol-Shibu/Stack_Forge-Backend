ALTER TABLE "projects" ALTER COLUMN "techStack" SET DEFAULT ARRAY[]::text[];--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "techStack" SET NOT NULL;