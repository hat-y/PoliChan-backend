// External Modules
import fp from 'fastify-plugin';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';

declare module 'fastify' {
  export interface FastifyRequest {
    correlationId: string;
    startTime: number;
  }
}

export interface LoggerOptions {
  level?: string;
  prettyPrint?: boolean;
}

async function loggerPlugin(fastify: FastifyInstance, options: LoggerOptions = {}) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const logLevel = process.env.LOG_LEVEL || options.level || 'debug';
  const prettyPrint = options.prettyPrint ?? isDevelopment;

  fastify.log.level = logLevel;

  // Configurar transport para pretty print si es necesario
  if (prettyPrint && isDevelopment) {
    console.log('Logger configured with pretty print mode');
  }

  // Genera correlation IDs y configura contexto
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const correlationId = (request.headers['x-request-id'] as string) || randomUUID();
    const startTime = Date.now();

    request.correlationId = correlationId;
    request.startTime = startTime;
    reply.header('X-Request-ID', correlationId);

    // Agrega correlation ID al contexto del logger
    request.log = request.log.child({
      correlationId,
      method: request.method,
      url: request.url,
      ip: request.ip || request.headers['x-forwarded-for'],
      userAgent: request.headers['user-agent']
    });

    request.log.info({
      event: 'Incoming request',
      method: request.method,
      url: request.url,
      ip: request.ip,
      userAgent: request.headers['user-agent']
    });
  });

  // Log de respuestas
  fastify.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    // Tiempo de Respuesta
    const responseTime = Date.now() - request.startTime;

    request.log.info({
      event: 'Response sent',
      statusCode: reply.statusCode,
      responseTime: `${responseTime.toFixed(2)}ms`,
      method: request.method,
      url: request.url
    });
  });

  // Errores no manejados
  fastify.addHook('onError', async (request: FastifyRequest, _reply: FastifyReply, error: Error): Promise<void> => {
    request.log.error({
      event: 'Unhandled error',
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    });
  });
}

export default fp(loggerPlugin, {
  name: 'logger-plugin',
  fastify: '5.x'
});
