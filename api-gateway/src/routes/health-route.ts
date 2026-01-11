import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const healthRoutes = (server: FastifyInstance) => {
  server.get('/health', (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({
      status: 'ok',
      service: 'api-gateway',
    });
  });
};
