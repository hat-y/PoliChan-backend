const fp = require('fastify-plugin');
const { v4: uuidv4 } = require('uuid');

async function loggerPlugin(fastify, options) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const logLevel = process.env.LOG_LEVEL || 'info';

  fastify.register(require('fastify-pino-logger'), {
    level: logLevel,
    transport: isDevelopment ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    } : undefined
  });

  fastify.addHook('onRequest', async (request, reply) => {
    const correlationId = request.headers['x-request-id'] || uuidv4();

    request.correlationId = correlationId;
    reply.header('X-Request-ID', correlationId);

    request.log = request.log.child({
      correlationId,
      method: request.method,
      url: request.url,
      ip: request.ip || request.headers['x-forwarded-for'] || request.connection.remoteAddress,
      userAgent: request.headers['user-agent']
    });

    request.log.info('Incoming request', {
      method: request.method,
      url: request.url,
      ip: request.ip
    });
  });

  fastify.addHook('onResponse', async (request, reply) => {
    request.log.info('Response sent', {
      statusCode: reply.statusCode,
      responseTime: reply.getResponseTime()
    });
  });
}

module.exports = fp(loggerPlugin, {
  name: 'fastify-logger-plugin',
  fastify: '4.x'
});