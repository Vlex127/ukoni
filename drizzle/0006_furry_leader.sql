DROP TABLE "sessions" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "admin" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "role";