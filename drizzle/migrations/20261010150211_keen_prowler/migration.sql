ALTER TABLE "profile" ADD COLUMN "viewCount" numeric;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "viewedProfile" text[] DEFAULT ARRAY[]::text[] NOT NULL;