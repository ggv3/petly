import { buildServer } from './server.js';

const server = buildServer();

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3002;
    const host = process.env.HOST || '0.0.0.0';

    await server.listen({ port, host });
    console.log(`User service running on http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
