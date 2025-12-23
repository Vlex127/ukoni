CREATE TABLE "subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"gmail" text,
	"first_name" text,
	"last_name" text,
	"status" text DEFAULT 'active',
	"source" text,
	"subscribed_at" timestamp DEFAULT now(),
	"unsubscribed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
