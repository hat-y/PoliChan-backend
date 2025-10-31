import Fastify, { FastifyInstance } from 'fastify';
import { UserModule } from '../../modules/user/user.module';
import loggerPlugin from '../plugins/logger.plugin';

export class HttpServer {
  private instance: FastifyInstance;

  constructor() {
    const isDevelopment = process.env.NODE_ENV === 'development';

    this.instance = Fastify({
      logger: {
        level: process.env.LOG_LEVEL || 'info',
        transport: isDevelopment ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname,reqId',
            messageFormat: '{correlationId} [{level}] {msg}'
          }
        } : undefined
      }
    });
  }

  public getInstance(): FastifyInstance {
    return this.instance;
  }

  public registerRoutes(): void {
    // Health check route
    this.instance.get('/', async (request, reply) => {
      request.log.info('Health check requested');

      return {
        message: 'Backend API',
        status: 'running',
        timestamp: new Date().toISOString(),
        correlationId: request.correlationId
      };
    });

    // Test logger endpoint
    this.instance.get('/test-logger', async (request, reply) => {
      const log = request.log;

      request.log.info('Testing logger functionality');
      request.log.debug('Debug message with additional context');
      request.log.warn('Warning message example');

      return {
        message: 'Logger test completed successfully',
        correlationId: request.correlationId,
        logLevels: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
        timestamp: new Date().toISOString()
      };
    });

    // Initialize User Module
    const userController = UserModule.initialize();

    // Register user routes
    this.registerUserRoutes(userController);
  }

  private registerUserRoutes(userController: UserController): void {
    // POST /api/users - Create user
    this.instance.post('/api/users', async (request, reply) => {
      const userData = request.body as any;

      request.log.info('Creating new user');

      try {
        const result = await userController.createUser(userData);

        if (result.success) {
          request.log.info('User created successfully');
          return reply.status(201).send(result.data);
        } else {
          request.log.warn('User creation failed');

          if (result.error && result.error.includes('already exists')) {
            return reply.status(409).send({ error: result.error });
          }
          return reply.status(400).send({ error: result.error });
        }
      } catch (error) {
        request.log.error('Unexpected error creating user');
        return reply.status(500).send({ error: 'Internal server error' });
      }
    });

    // GET /api/users - Get all users
    this.instance.get('/api/users', async (request, reply) => {
      request.log.info('Fetching all users');

      try {
        const result = await userController.getAllUsers();

        if (result.success) {
          request.log.info('Users fetched successfully');
          return reply.status(200).send({
            users: result.data,
            count: result.count
          });
        } else {
          request.log.error('Failed to fetch users');
          return reply.status(500).send({ error: result.error });
        }
      } catch (error) {
        request.log.error('Unexpected error fetching users');
        return reply.status(500).send({ error: 'Internal server error' });
      }
    });
  }

  public async initialize(): Promise<void> {
    // Register logger plugin first
    await this.instance.register(loggerPlugin, {
      level: process.env.LOG_LEVEL || 'info',
      prettyPrint: process.env.NODE_ENV === 'development'
    });

    this.instance.log.info('HTTP Server initialized', {
      nodeEnv: process.env.NODE_ENV,
      logLevel: process.env.LOG_LEVEL
    });
  }

  public async start(port: number, host: string): Promise<void> {
    try {
      await this.instance.listen({ port, host });
      this.instance.log.info(`Server listening on http://${host}:${port}`, {
        port,
        host,
        pid: process.pid
      });
    } catch (err) {
      this.instance.log.error('Failed to start server');
      throw err;
    }
  }

  public async close(): Promise<void> {
    await this.instance.close();
  }
}
