import cors from '@fastify/cors';
import proxy from '@fastify/http-proxy';
import rateLimit from '@fastify/rate-limit';
import { env } from 'config/env.js';
import type { FastifyInstance } from 'fastify';
import Fastify from 'fastify';
import { healthRoutes } from 'routes/health-route.js';

export const buildServer = (options?: { logger?: boolean }): FastifyInstance => {
  const server: FastifyInstance = Fastify({
    logger: options?.logger ?? true,
  });

  // Register CORS
  const allowedOrigins =
    env.NODE_ENV === 'production'
      ? [env.CORS_ORIGIN as string]
      : ['http://localhost:5173', 'http://127.0.0.1:5173'];

  server.register(cors, {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST'],
  });

  // Register rate limiting
  server.register(rateLimit, {
    global: false, // Don't apply globally, we'll apply per-route
  });

  // Register health route
  server.register(healthRoutes);

  // Register proxy routes for microservices
  server.register(proxy, {
    upstream: env.AUTH_SERVICE_URL,
    prefix: '/api/auth',
    rewritePrefix: '/auth',
  });

  server.register(proxy, {
    upstream: env.USER_SERVICE_URL,
    prefix: '/api/user',
    rewritePrefix: '/user',
  });

  server.register(proxy, {
    upstream: env.PET_SERVICE_URL,
    prefix: '/api/pet',
    rewritePrefix: '/pet',
  });

  server.register(proxy, {
    upstream: env.RENTAL_SERVICE_URL,
    prefix: '/api/rental',
    rewritePrefix: '/rental',
  });

  return server;
};
