import { z } from 'zod';

const envSchema = z.object({
  // Server
  PORT: z.string().default('3004'),
  HOST: z.string().default('0.0.0.0'),

  // Database
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().default('5432'),
  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
});

export const env = envSchema.parse(process.env);
