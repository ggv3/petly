import type { FastifyInstance } from "fastify";
import Fastify from "fastify";

export const buildServer = (): FastifyInstance => {
	const server: FastifyInstance = Fastify({
		logger: true,
	});

	// Health check endpoint
	server.get("/health", async () => {
		return { status: "ok", service: "auth-service" };
	});

	return server;
};
