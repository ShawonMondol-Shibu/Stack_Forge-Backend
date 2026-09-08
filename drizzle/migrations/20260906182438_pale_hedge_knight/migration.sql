CREATE TABLE "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"title" text,
	"content" text,
	"tag" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_note_idx" UNIQUE("user_id","id")
);
--> statement-breakpoint
ALTER TABLE "follows" DROP CONSTRAINT "prevent_self_follow";--> statement-breakpoint
ALTER TABLE "follows" DROP CONSTRAINT "follows_follower_id_users_id_fkey";--> statement-breakpoint
ALTER TABLE "follows" DROP CONSTRAINT "follows_following_id_users_id_fkey";--> statement-breakpoint
DROP TABLE "users";--> statement-breakpoint
ALTER TABLE "follows" ALTER COLUMN "follower_id" SET DATA TYPE text USING "follower_id"::text;--> statement-breakpoint
ALTER TABLE "follows" ALTER COLUMN "following_id" SET DATA TYPE text USING "following_id"::text;--> statement-breakpoint
CREATE INDEX "user_notes_idx" ON "notes" ("user_id");--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_user_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_user_id_fkey" FOREIGN KEY ("following_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "prevent_self_follow" CHECK ("follower_id" <> "following_id");