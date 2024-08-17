import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

config({ path: '.env' });

console.log(process.env.DATABASE_URL);

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client);