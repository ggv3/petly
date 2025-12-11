import rateLimit from "@fastify/rate-limit";
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

  // Register rate limiting
  server.register(rateLimit, {
    global: false, // Don't apply globally, we'll apply per-route
  });

  // Register routes
  server.register(healthRoutes);
  server.register(authRoutes);

  return server;
};
