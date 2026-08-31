CREATE TABLE "follows" (
	"follower_id" uuid,
	"following_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "follows_pkey" PRIMARY KEY("follower_id","following_id"),
	CONSTRAINT "prevent_self_follow" CHECK ("follower_id" <> "following_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid()
);
--> statement-breakpoint
CREATE INDEX "idx_follows_following_id" ON "follows" ("following_id");--> statement-breakpoint
CREATE INDEX "idx_follows_follower_created" ON "follows" ("follower_id","created_at");--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_users_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_users_id_fkey" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE CASCADE;