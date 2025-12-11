import type { FastifyInstance } from "fastify";
import Fastify from "fastify";
import { authRoutes } from "./routes/auth.js";
import { healthRoutes } from "./routes/health.js";

export const buildServer = (options?: {
	logger?: boolean;
}): FastifyInstance => {
	const server: FastifyInstance = Fastify({
		logger: options?.logger ?? true,
	});

	// Register routes
	server.register(healthRoutes);
	server.register(authRoutes);

	return server;
};
