import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  HOST: z.string().default('0.0.0.0'),
  CORS_ORIGIN: z.string().optional(),
  AUTH_SERVICE_URL: z.string().default('http://auth-service:3001'),
  USER_SERVICE_URL: z.string().default('http://user-service:3002'),
  PET_SERVICE_URL: z.string().default('http://pet-service:3003'),
  RENTAL_SERVICE_URL: z.string().default('http://rental-service:3004'),
});

// Validate CORS_ORIGIN is set in production
const parsed = envSchema.parse(process.env);
if (parsed.NODE_ENV === 'production' && !parsed.CORS_ORIGIN) {
  throw new Error('CORS_ORIGIN must be set in production environment');
}

export const env = parsed;
