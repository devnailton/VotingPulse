import { db } from './db';
import { users, votes } from '@shared/schema';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('Creating database schema...');

  // Create the users table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `);
  console.log('Users table created or already exists');

  // Create the votes table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS votes (
      id SERIAL PRIMARY KEY,
      interviewer_name TEXT NOT NULL,
      interviewee_name TEXT NOT NULL,
      interviewee_email TEXT NOT NULL,
      age INTEGER NOT NULL,
      profession TEXT NOT NULL,
      case_example TEXT,
      vote_type TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    )
  `);
  console.log('Votes table created or already exists');

  console.log('Database schema created successfully');
  process.exit(0);
}

main().catch((error) => {
  console.error('Error setting up database schema:', error);
  process.exit(1);
});