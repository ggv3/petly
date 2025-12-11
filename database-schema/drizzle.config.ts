import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.POSTGRES_USER || 'petly_dev',
    password: process.env.POSTGRES_PASSWORD || 'petly_dev',
    database: process.env.POSTGRES_DB || 'petly_dev',
  },
});
