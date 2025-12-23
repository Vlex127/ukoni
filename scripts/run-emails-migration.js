const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function runMigration() {
  const client = new Client(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    console.log('Connected to database');
    
    const migrationSQL = `
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
    `;
    
    await client.query(migrationSQL);
    console.log('Emails table created successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.end();
  }
}

runMigration();
