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
import { MessageBus } from '../../domain/message-bus';
import { getLoggerOptions } from '../common/logger/logger.options';

export class HttpServer {
  private instance: FastifyInstance;
  private userController?: UserController;
  private messageBus: MessageBus;

  constructor(messageBus: MessageBus) {
    this.messageBus = messageBus;

    this.instance = Fastify({ logger: getLoggerOptions() });

    this.instance.register(loggerPlugin, {
      level: process.env.LOG_LEVEL || 'info',
      prettyPrint: process.env.NODE_ENV === 'development',
    });
  }

  public getInstance(): FastifyInstance {
    return this.instance;
  }

  public async registerRoutes(): Promise<void> {
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

    // Usa el messageBus recibido por el constructor
    this.userController = UserModule.initialize(this.messageBus);

    // Registra las rutas de usuario
    this.registerUserRoutes(this.userController);
  }

  private registerUserRoutes(userController: UserController): void {
    this.instance.post('/api/user/register', (req, reply) =>
      userController.registerUser(req, reply)
    );
    this.instance.post('/api/user/login', (req, reply) =>
      userController.loginUser(req, reply)
    );
    this.instance.put('/api/user/:userId', (req, reply) =>
      userController.updateUser(req, reply)
    );
    this.instance.get('/api/user/:userId', (req, reply) =>
      userController.findUser(req, reply)
    );
    this.instance.get('/api/user', (req, reply) =>
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
      this.instance.log.info(`Server listening on http://localhost:${port}`);
    } catch (err) {
      this.instance.log.error('Failed to start server');
      throw err;
    }
  }

  public async close(): Promise<void> {
    await this.instance.close();
  }
}
