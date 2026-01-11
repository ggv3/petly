import type { FastifyInstance } from 'fastify';

export const healthRoutes = (server: FastifyInstance) => {
  server.get('/health', () => {
    return { status: 'ok', service: 'user-service' };
  });
};
