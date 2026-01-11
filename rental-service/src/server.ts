import rateLimit from '@fastify/rate-limit';
import type { FastifyInstance } from 'fastify';
import Fastify from 'fastify';
import { healthRoutes } from 'routes/health-route.js';

export const buildServer = (options?: { logger?: boolean }): FastifyInstance => {
  const server: FastifyInstance = Fastify({
    logger: options?.logger ?? true,
  });

  // Register rate limiting
  server.register(rateLimit, {
    global: false, // Don't apply globally, we'll apply per-route
  });

  // Register routes
  server.register(healthRoutes);

  return server;
};
