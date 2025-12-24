import 'server-only';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// This check is crucial for Vercel builds.
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(process.env.DATABASE_URL);

// The global variable trick is to maintain a single instance across hot reloads in development.
// In production, this will always be a single instance.
declare global {
  var db: NeonHttpDatabase<typeof schema> | undefined;
}

let db: NeonHttpDatabase<typeof schema>;

if (process.env.NODE_ENV === 'production') {
  db = drizzle(sql, { schema });
} else {
  if (!global.db) {
    global.db = drizzle(sql, { schema });
  }
  db = global.db;
}

export { db };
export * from './schema';
