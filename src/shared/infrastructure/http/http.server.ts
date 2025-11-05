import 'reflect-metadata';
import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteGenericInterface,
} from 'fastify';
import fastifyEnv from '@fastify/env';
import { envSchema } from '../common/env/env.schema';

// Internals Modules
import { UserModule } from '../../../modules/user/user.module';
import { PostModule } from '../../../modules/post/post.module';
import loggerPlugin from '../plugins/logger.plugin';
import { UserController } from '../../../modules/user/presentation/controllers/user.controller';
import { PostController } from '../../../modules/post/presentation/controllers/post.controller';
import { MessageBus } from '../../domain/message-bus';

export class HttpServer {
  private instance: FastifyInstance;
  private userController?: UserController;
  private postController?: PostController;
  private messageBus: MessageBus;

  constructor(messageBus: MessageBus) {
    this.messageBus = messageBus;
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
    this.postController = PostModule.initialize(this.messageBus);

    // Registra las rutas
    this.registerUserRoutes(this.userController);
    this.registerPostRoutes(this.postController);
  }

  private registerUserRoutes(userController: UserController): void {
    this.instance.post('/api/users', (req, reply) =>
      userController.registerUser(req, reply)
    );
    this.instance.put('/api/users/:userId', (req, reply) =>
      userController.updateUser(req, reply)
    );
    this.instance.get('/api/users/:userId', (req, reply) =>
      userController.findUser(req, reply)
    );
    this.instance.get('/api/users', (req, reply) =>
      userController.getAllUsers(req, reply)
    );
  }

  private registerPostRoutes(postController: PostController): void {
    // ===== COMMANDS  =====
    this.instance.post('/api/posts', (
      req: FastifyRequest<RouteGenericInterface>, reply: FastifyReply<RouteGenericInterface>
    ): any =>
      postController.createPost(req, reply)
    );

    this.instance.delete('/api/posts/:postId', (
      req: FastifyRequest<RouteGenericInterface>, reply: FastifyReply<RouteGenericInterface>
    ): any =>
      postController.deletePost(req, reply)
    );

    this.instance.post('/api/posts/:postId/like', (
      req: FastifyRequest<RouteGenericInterface>, reply: FastifyReply<RouteGenericInterface>
    ): any =>
      postController.likePost(req, reply)
    );

    this.instance.post('/api/posts/:postId/unlike', (
      req: FastifyRequest<RouteGenericInterface>, reply: FastifyReply<RouteGenericInterface>
    ): any =>
      postController.unlikePost(req, reply)
    );

    // ===== QUERIES (Read Operations) =====
    this.instance.get('/api/posts/:postId', (
      req: FastifyRequest<RouteGenericInterface>, reply: FastifyReply<RouteGenericInterface>
    ): Promise<void> =>
      postController.getPost(req, reply)
    );

    this.instance.get('/api/posts', (
      req: FastifyRequest<RouteGenericInterface>, reply: FastifyReply<RouteGenericInterface>
    ): any =>
      postController.getAllPosts(req, reply)
    );

    this.instance.get('/api/posts/user/:userId', (
      req: FastifyRequest<RouteGenericInterface>, reply: FastifyReply<RouteGenericInterface>
    ): Promise<void> =>
      postController.getPostsByUser(req, reply)
    );

    this.instance.get('/api/posts/timeline', (
      req: FastifyRequest<RouteGenericInterface>, reply: FastifyReply<RouteGenericInterface>
    ): Promise<void> =>
      postController.getTimeline(req, reply)
    );

    this.instance.get('/api/posts/user/:userId/timeline', (
      req: FastifyRequest<RouteGenericInterface>, reply: FastifyReply<RouteGenericInterface>
    ): Promise<void> =>
      postController.getUserTimeline(req, reply)
    );

    this.instance.get('/api/posts/most-liked', (
      req: FastifyRequest<RouteGenericInterface>, reply: FastifyReply<RouteGenericInterface>
    ): Promise<void> =>
      postController.getMostLikedPosts(req, reply)
    );

    this.instance.get('/api/posts/by-likes', (
      req: FastifyRequest<RouteGenericInterface>, reply: FastifyReply<RouteGenericInterface>
    ): Promise<void> =>
      postController.getPostsByLikesRange(req, reply)
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
