import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use the Neon database connection string
const connectionString = "postgresql://neondb_owner:npg_FSq2wvnb7mAl@ep-delicate-dawn-a4tiibhq-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";

if (!connectionString) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString });
export const db = drizzle({ client: pool, schema });