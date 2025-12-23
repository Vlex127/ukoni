require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function addProfileColumns() {
  try {
    console.log('Adding profile columns to users table...');
    
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS about text;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone text;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS location text;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS website text;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS twitter text;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin text;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS facebook text;`;
    
    console.log('Profile columns added successfully!');
  } catch (error) {
    console.error('Error adding profile columns:', error);
  }
}

addProfileColumns();
