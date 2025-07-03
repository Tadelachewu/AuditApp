import 'dotenv/config';
import { Pool } from 'pg';

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

export const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.POSTGRES_URL.includes('sslmode=disable') 
    ? false 
    : { rejectUnauthorized: false },
});
