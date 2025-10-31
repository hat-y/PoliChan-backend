import fp from 'fastify-plugin';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';

declare module 'fastify' {
  export interface FastifyRequest {
    correlationId: string;
  }
}

export interface LoggerOptions {
  level?: string;
  prettyPrint?: boolean;
}

async function loggerPlugin(fastify: FastifyInstance, options: LoggerOptions = {}) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const logLevel = process.env.LOG_LEVEL || options.level || 'info';
  const prettyPrint = options.prettyPrint ?? isDevelopment;

  // Fastify 5.x ya viene con logger pino integrado
  // Configuramos el logger directamente en la instancia
  fastify.log.level = logLevel;

  if (prettyPrint && !fastify.log.transport) {
    fastify.log.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
        messageFormat: '{correlationId} [{level}] {msg}',
        customPrettifiers: {
          time: (timestamp: string) => `🕒 ${new Date(timestamp).toLocaleTimeString()}`,
          level: (logLevel: string) => {
            const levels: Record<string, string> = {
              trace: '🐛 TRACE',
              debug: '🔍 DEBUG',
              info: 'ℹ️  INFO',
              warn: '⚠️  WARN',
              error: '❌ ERROR',
              fatal: '💀 FATAL'
            };
            return levels[logLevel] || logLevel.toUpperCase();
          }
        }
      }
    };
  }

  // Hook para generar correlation IDs y configurar contexto
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    // Usar el UUID nativo de Node.js (crypto.randomUUID())
    const correlationId = (request.headers['x-request-id'] as string) || randomUUID();

    request.correlationId = correlationId;
    reply.header('X-Request-ID', correlationId);

    // Agregar correlation ID al contexto del logger
    request.log = request.log.child({
      correlationId,
      method: request.method,
      url: request.url,
      ip: request.ip || request.headers['x-forwarded-for'],
      userAgent: request.headers['user-agent']
    });

    request.log.info('Incoming request', {
      method: request.method,
      url: request.url,
      ip: request.ip,
      userAgent: request.headers['user-agent']
    });
  });

  // Hook para log de respuestas
  fastify.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
    const responseTime = reply.getResponseTime?.() ?? 0;

    request.log.info('Response sent', {
      statusCode: reply.statusCode,
      responseTime: `${responseTime.toFixed(2)}ms`,
      method: request.method,
      url: request.url
    });
  });

  // Hook para errores no manejados
  fastify.addHook('onError', async (request: FastifyRequest, reply: FastifyReply, error: Error) => {
    request.log.error('Unhandled error');
  });
}

export default fp(loggerPlugin, {
  name: 'logger-plugin',
  fastify: '5.x'
});