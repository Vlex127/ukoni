-- Add role column to users table
ALTER TABLE "users" ADD COLUMN "role" text DEFAULT 'user';

-- Update existing users to have 'user' role (in case they have NULL)
UPDATE "users" SET "role" = 'user' WHERE "role" IS NULL;

-- Add constraint to ensure only valid roles
ALTER TABLE "users" ADD CONSTRAINT "users_role_check" CHECK ("role" IN ('user', 'admin', 'moderator'));
