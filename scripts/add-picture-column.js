const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function addPictureColumn() {
  try {
    await sql`ALTER TABLE "users" ADD COLUMN "picture" text;`;
    console.log('Picture column added successfully');
  } catch (error) {
    console.error('Error adding picture column:', error);
  }
}

addPictureColumn();
