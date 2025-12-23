const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function runMigration() {
  try {
    const migrationSQL = fs.readFileSync('./drizzle/0000_puzzling_tombstone.sql', 'utf8');
    
    // Split the SQL by statement breakpoints and execute each statement
    const statements = migrationSQL.split('--> statement-breakpoint');
    
    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed) {
        console.log('Executing:', trimmed.substring(0, 50) + '...');
        await sql.query(trimmed);
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigration();
