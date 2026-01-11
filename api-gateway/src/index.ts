import { env } from './config/env.js';
import { buildServer } from './server.js';

const server = buildServer();

const start = async () => {
  try {
    const port = Number(env.PORT);
    const host = env.HOST;

    await server.listen({ port, host });
    console.log(`API Gateway running on http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
