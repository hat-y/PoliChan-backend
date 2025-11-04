import Fastify from 'fastify';
import fastifyEnv from '@fastify/env';
import { envSchema } from './shared/infrastructure/common/env/env.schema';
import { AppBootstrap } from './shared/infrastructure/bootstrap/app.bootstrap';
import { Container } from './shared/infrastructure/bootstrap/container';
import { HttpServer } from './shared/infrastructure/http/http.server';

const bootstrap = async (): Promise<void> => {
  try {
    const fastify = Fastify();
    fastify.register(fastifyEnv, {
      schema: envSchema,
      dotenv: true,
    });

    await fastify.ready();

    const container = new Container();

    await container.initiliaze();

    const app = new AppBootstrap(container.httpServer);

    await app.initialize();
    await app.start();
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
};

bootstrap();
