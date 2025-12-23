import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function POST() {
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
    
    return NextResponse.json({ success: true, message: 'Emails table created successfully' });
  } catch (error) {
    console.error('Failed to create emails table:', error);
    return NextResponse.json({ error: 'Failed to create emails table' }, { status: 500 });
  }
}
