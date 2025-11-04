import { HttpServer } from '../http/http.server';
import { MessageBus } from '../../domain/message-bus';

export class AppBootstrap {
  private httpServer: HttpServer;

  constructor(httpServer: HttpServer) {
    this.httpServer = httpServer;
  }

  public async initialize(): Promise<void> {
    // Primero registra las rutas
    await this.httpServer.registerRoutes();
    // Luego inicializa Fastify (ready)
    await this.httpServer.initialize();
  }

  public async start(): Promise<void> {
    const port = Number(process.env.PORT) || 3000;
    const host = process.env.HOST || '0.0.0.0';

    await this.httpServer.start(port, host);
  }

  public async shutdown(): Promise<void> {
    await this.httpServer.close();
  }
}
