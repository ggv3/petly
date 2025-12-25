import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { HTTP_STATUS, PASSWORD, RATE_LIMIT, USERNAME } from '../constants.js';
import { login, logout, refresh, register } from '../services/auth-service.js';

const registerSchema = z.object({
  username: z.string().min(USERNAME.MIN_LENGTH).max(USERNAME.MAX_LENGTH),
  password: z.string().min(PASSWORD.MIN_LENGTH).max(PASSWORD.MAX_LENGTH),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

export const authRoutes = (server: FastifyInstance) => {
  server.post(
    '/auth/register',
    {
      config: {
        rateLimit: {
          max: RATE_LIMIT.REGISTER.MAX,
          timeWindow: RATE_LIMIT.REGISTER.TIME_WINDOW,
        },
      },
    },
    async (request, reply) => {
      try {
        const body = registerSchema.parse(request.body);
        const tokens = await register(body);
        return reply.code(HTTP_STATUS.CREATED).send(tokens);
      } catch (error) {
        if (error instanceof Error) {
          return reply.code(HTTP_STATUS.BAD_REQUEST).send({ error: error.message });
        }
        return reply
          .code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
          .send({ error: 'Internal server error' });
      }
    },
  );

  server.post(
    '/auth/login',
    {
      config: {
        rateLimit: {
          max: RATE_LIMIT.LOGIN.MAX,
          timeWindow: RATE_LIMIT.LOGIN.TIME_WINDOW,
        },
      },
    },
    async (request, reply) => {
      try {
        const body = loginSchema.parse(request.body);
        const tokens = await login(body);
        return reply.send(tokens);
      } catch (error) {
        if (error instanceof Error) {
          return reply.code(HTTP_STATUS.UNAUTHORIZED).send({ error: error.message });
        }
        return reply
          .code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
          .send({ error: 'Internal server error' });
      }
    },
  );

  server.post(
    '/auth/refresh',
    {
      config: {
        rateLimit: {
          max: RATE_LIMIT.REFRESH.MAX,
          timeWindow: RATE_LIMIT.REFRESH.TIME_WINDOW,
        },
      },
    },
    async (request, reply) => {
      try {
        const body = refreshSchema.parse(request.body);
        const tokens = await refresh(body.refreshToken);
        return reply.send(tokens);
      } catch (error) {
        if (error instanceof Error) {
          return reply.code(HTTP_STATUS.UNAUTHORIZED).send({ error: error.message });
        }
        return reply
          .code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
          .send({ error: 'Internal server error' });
      }
    },
  );

  server.post(
    '/auth/logout',
    {
      config: {
        rateLimit: {
          max: RATE_LIMIT.LOGOUT.MAX,
          timeWindow: RATE_LIMIT.LOGOUT.TIME_WINDOW,
        },
      },
    },
    async (request, reply) => {
      try {
        const body = refreshSchema.parse(request.body);
        await logout(body.refreshToken);
        return reply.code(HTTP_STATUS.NO_CONTENT).send();
      } catch (error) {
        if (error instanceof Error) {
          return reply.code(HTTP_STATUS.BAD_REQUEST).send({ error: error.message });
        }
        return reply
          .code(HTTP_STATUS.INTERNAL_SERVER_ERROR)
          .send({ error: 'Internal server error' });
      }
    },
  );
};
