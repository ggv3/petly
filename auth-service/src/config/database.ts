import { refreshToken, user } from '@petly/database-schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from './env.js';

const connectionString = `postgresql://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.POSTGRES_DB}`;

export const client = postgres(connectionString);
export const db = drizzle(client, { schema: { user, refreshToken } });
