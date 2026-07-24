CREATE TYPE "availability" AS ENUM('open', 'busy', 'unavailable');--> statement-breakpoint
CREATE TABLE "profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"full_name" text NOT NULL,
	"headline" text,
	"bio" text,
	"location" text,
	"website" text,
	"avatar_url" text,
	"cover_url" text,
	"availability" "availability" DEFAULT 'open'::"availability"
);
--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;