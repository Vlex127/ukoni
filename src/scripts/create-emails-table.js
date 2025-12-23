import { db } from '../lib/db/index.ts';
import { sql } from 'drizzle-orm';

async function createEmailsTable() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "emails" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "subject" text NOT NULL,
        "content" text NOT NULL,
        "audience" text DEFAULT 'all' NOT NULL,
        "status" text DEFAULT 'draft' NOT NULL,
        "scheduled_at" timestamp,
        "sent_at" timestamp,
        "stats" json,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      );
    `);
    console.log('Emails table created successfully');
  } catch (error) {
    console.error('Failed to create emails table:', error);
  }
}

createEmailsTable();
