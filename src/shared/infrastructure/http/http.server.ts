// Externals Modules
import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fastifyEnv from '@fastify/env';
import { envSchema } from '../common/env/env.schema';

// Internals Modules
import { UserModule } from '../../../modules/user/user.module';
import loggerPlugin from '../plugins/logger.plugin';
import { UserController } from '../../../modules/user/presentation/controllers/user.controller';

export class HttpServer {
  private instance: FastifyInstance;

  constructor() {
    const isDevelopment = process.env.NODE_ENV === 'development';

    this.instance = Fastify({
      logger: {
        level: process.env.LOG_LEVEL || 'info',
        transport: isDevelopment
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname,reqId',
                messageFormat: '{correlationId} [{level}] {msg}',
              },
            }
          : undefined,
      },
    });
    this.instance.register(fastifyEnv, {
      schema: envSchema,
      dotenv: true,
    });
    this.instance.register(loggerPlugin, {
      level: process.env.LOG_LEVEL || 'info',
      prettyPrint: process.env.NODE_ENV === 'development',
    });
  }

  public getInstance(): FastifyInstance {
    return this.instance;
  }

  public registerRoutes(): void {
    // Health check route
    this.instance.get(
      '/',
      async (
        request: FastifyRequest,
        _reply: FastifyReply
      ): Promise<{
        message: string;
        status: string;
        timestamp: string;
        correlationId: string;
      }> => {
        request.log.info('Health check requested');

        return {
          message: 'Backend API',
          status: 'running',
          timestamp: new Date().toISOString(),
          correlationId: request.correlationId,
        };
      }
    );

    // Test logger endpoint
    this.instance.get(
      '/test-logger',
      async (
        request: FastifyRequest,
        _reply: FastifyReply
      ): Promise<{
        message: string;
        correlationId: string;
        logLevels: string[];
        timestamp: string;
      }> => {
        const log = request.log;

        log.info('Testing logger functionality');
        log.debug('Debug message with additional context');
        log.warn('Warning message example');

        return {
          message: 'Logger test completed successfully',
          correlationId: request.correlationId,
          logLevels: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
          timestamp: new Date().toISOString(),
        };
      }
    );

    // Initialize User Module
    const userController = UserModule.initialize();

    // Register user routes
    this.registerUserRoutes(userController);
  }

  private registerUserRoutes(userController: UserController): void {
    // POST /api/users - Crear usuario
    this.instance.post('/api/users', (req, reply) =>
      userController.registerUser(req, reply)
    );

    // PUT /api/users/:userId - Actualizar usuario
    this.instance.put('/api/users/:userId', (req, reply) =>
      userController.updateUser(req, reply)
    );

    // GET /api/users/:userId - Buscar usuario por ID
    this.instance.get('/api/users/:userId', (req, reply) =>
      userController.findUser(req, reply)
    );

    // GET /api/users - Obtener todos los usuarios
    this.instance.get('/api/users', (req, reply) =>
      userController.getAllUsers(req, reply)
    );
  }

  public async initialize(): Promise<void> {
    await this.instance.ready();

    this.instance.log.info(
      {
        nodeEnv: process.env.NODE_ENV,
        logLevel: process.env.LOG_LEVEL,
      },
      'HTTP Server initialized'
    );
  }

  public async start(port: number, host: string): Promise<void> {
    try {
      await this.instance.listen({ port, host });
      this.instance.log.info(
        {
          port,
          host,
          pid: process.pid,
        },
        `Server listening on http://localhost:${port}`
      );
    } catch (err) {
      this.instance.log.error('Failed to start server');
      throw err;
    }
  }

  public async close(): Promise<void> {
    await this.instance.close();
  }
}
