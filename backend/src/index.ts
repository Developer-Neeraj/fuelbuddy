import fastify from 'fastify';
import cors from '@fastify/cors';
import { taskRoutes } from './routes/task.routes';

const server = fastify({
  logger: true
});

// Register plugins
server.register(cors, {
  origin: true
});

// Register routes
server.register(taskRoutes, { prefix: '/api' });

// Health check route
server.get('/health', async () => {
  return { status: 'ok' };
});

// Start server
const start = async () => {
  try {
    await server.listen({ port: 3000, host: 'localhost' });
    console.log('Server is running on http://localhost:3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();