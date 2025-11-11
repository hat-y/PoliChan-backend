import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteGenericInterface,
} from 'fastify';
import fastifyWebsocket from '@fastify/websocket';

// Internals Modules
import { UserModule } from '../../../modules/user/user.module';
import { PostModule } from '../../../modules/post/post.module';
import { CommentsModule } from '../../../modules/comments/comments.module';
import loggerPlugin from './plugins/logger.plugin';
import { UserController } from '../../../modules/user/presentation/controllers/user.controller';
import { PostController } from '../../../modules/post/presentation/controllers/post.controller';
import { CommentsController } from '../../../modules/comments/presentation/controllers/comments.controller';
import { MentionsController } from '../../../modules/post/presentation/controllers/mentions.controller';
import { MessageBus } from '../../domain/message-bus';
import { getLoggerOptions } from '../common/logger/logger.options';
import jwtAuthPlugin from './plugins/jwt-auth.plugin';
import { userRoutes } from '../../../modules/user/presentation/routes/user.route';
import { postRoutes } from '../../../modules/post/presentation/routes/post.route';
import { commentsRoutes } from '../../../modules/comments/presentation/routes/comments.route';
import { mentionsRoutes } from '../../../modules/post/presentation/routes/mentions.route';

export class HttpServer {
  private instance: FastifyInstance;
  private userController?: UserController;
  private postController?: PostController;
  private commentsController?: CommentsController;
  private mentionsController?: MentionsController;
  private messageBus: MessageBus;
  private sockets: any[] = []; // Array para los sockets activos

  constructor(messageBus: MessageBus) {
    this.messageBus = messageBus;

    this.instance = Fastify({ logger: getLoggerOptions() });

    this.instance.register(loggerPlugin, {
      level: process.env.LOG_LEVEL || 'info',
      prettyPrint: process.env.NODE_ENV === 'development',
    });

    this.instance.register(jwtAuthPlugin);

    // Registra el plugin de WebSocket
    this.instance.register(fastifyWebsocket);

    // Registra la ruta WebSocket y guarda los sockets conectados
    this.instance.register((fastify) => {
      fastify.get('/ws', { websocket: true }, (socket, req) => {
        this.sockets.push(socket);
        console.log('Nuevo socket conectado, total:', this.sockets.length); // <-- Agrega este log
        socket.send('Conectado al WebSocket de PoliChan');
        socket.on('close', () => {
          this.sockets = this.sockets.filter((s) => s !== socket);
        });
        socket.on('message', (message) => {
          socket.send(`Echo: ${message.toString()}`);
        });
      });
    });
  }

  public getInstance(): FastifyInstance {
    return this.instance;
  }

  // Devuelve el array de sockets conectados
  public getWebSocketServer() {
    return this.sockets;
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

    // Inicializa los Controllers con el messageBus
    this.userController = UserModule.initialize(this.messageBus);
    this.postController = PostModule.initialize(this.messageBus);
    this.commentsController = CommentsModule.initialize(this.messageBus);
    this.mentionsController = new MentionsController(this.messageBus);

    // Registra las rutas
    await userRoutes(this.instance, this.userController);
    await postRoutes(this.instance, this.postController);
    await commentsRoutes(this.instance, this.commentsController);
    await mentionsRoutes(this.instance, this.mentionsController);
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
