import Fastify from 'fastify';
import { UserModule } from '../../modules/user/user.module';

export class HttpServer {
  private instance: FastifyInstance;

  constructor() {
    this.instance = Fastify({
      logger: false
    });
  }

  public getInstance(): FastifyInstance {
    return this.instance;
  }

  public registerRoutes(): void {
    // Health check route
    this.instance.get('/', async (_request, _reply) => {
      return {
        message: 'Backend API',
        status: 'running',
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
      const result = await userController.createUser(request.body as any);

      if (result.success) {
        return reply.status(201).send(result.data);
      } else {
        if (result.error && result.error.includes('already exists')) {
          return reply.status(409).send({ error: result.error });
        }
        return reply.status(400).send({ error: result.error });
      }
    });

    // GET /api/users - Get all users
    this.instance.get('/api/users', async (request, reply) => {
      const result = await userController.getAllUsers();

      if (result.success) {
        return reply.status(200).send({
          users: result.data,
          count: result.count
        });
      } else {
        return reply.status(500).send({ error: result.error });
      }
    });
  }

  public async start(port: number, host: string): Promise<void> {
    try {
      await this.instance.listen({ port, host });
      console.log(`Server listening on http://${host}:${port}`);
    } catch (err) {
      console.error('Failed to start server:', err);
      throw err;
    }
  }

  public async close(): Promise<void> {
    await this.instance.close();
  }
}
