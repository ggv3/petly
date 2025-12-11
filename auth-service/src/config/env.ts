import { z } from "zod";

const envSchema = z.object({
	// Server
	PORT: z.string().default("3001"),
	HOST: z.string().default("0.0.0.0"),

	// Database
	DB_HOST: z.string().default("localhost"),
	DB_PORT: z.string().default("5432"),
	POSTGRES_DB: z.string(),
	POSTGRES_USER: z.string(),
	POSTGRES_PASSWORD: z.string(),

	// JWT
	JWT_ACCESS_SECRET: z.string().min(32),
	JWT_REFRESH_SECRET: z.string().min(32),
	JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
	JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
