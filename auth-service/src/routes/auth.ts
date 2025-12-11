import type { FastifyInstance } from "fastify";
import { z } from "zod";
import * as authService from "../services/auth-service.js";

const registerSchema = z.object({
	username: z.string().min(3).max(50),
	password: z.string().min(8).max(100),
});

const loginSchema = z.object({
	username: z.string(),
	password: z.string(),
});

const refreshSchema = z.object({
	refreshToken: z.string(),
});

export const authRoutes = async (server: FastifyInstance) => {
	server.post("/auth/register", async (request, reply) => {
		try {
			const body = registerSchema.parse(request.body);
			const tokens = await authService.register(body);
			return reply.code(201).send(tokens);
		} catch (error) {
			if (error instanceof Error) {
				return reply.code(400).send({ error: error.message });
			}
			return reply.code(500).send({ error: "Internal server error" });
		}
	});

	server.post(
		"/auth/login",
		{
			config: {
				rateLimit: {
					max: 5, // Maximum 5 requests
					timeWindow: "1 minute", // Per minute
				},
			},
		},
		async (request, reply) => {
			try {
				const body = loginSchema.parse(request.body);
				const tokens = await authService.login(body);
				return reply.send(tokens);
			} catch (error) {
				if (error instanceof Error) {
					return reply.code(401).send({ error: error.message });
				}
				return reply.code(500).send({ error: "Internal server error" });
			}
		},
	);

	server.post("/auth/refresh", async (request, reply) => {
		try {
			const body = refreshSchema.parse(request.body);
			const tokens = await authService.refresh(body.refreshToken);
			return reply.send(tokens);
		} catch (error) {
			if (error instanceof Error) {
				return reply.code(401).send({ error: error.message });
			}
			return reply.code(500).send({ error: "Internal server error" });
		}
	});

	server.post("/auth/logout", async (request, reply) => {
		try {
			const body = refreshSchema.parse(request.body);
			await authService.logout(body.refreshToken);
			return reply.code(204).send();
		} catch (error) {
			if (error instanceof Error) {
				return reply.code(400).send({ error: error.message });
			}
			return reply.code(500).send({ error: "Internal server error" });
		}
	});
};
