import { HttpServer } from '../http/http.server';

export class AppBootstrap {
  private httpServer: HttpServer;

  constructor() {
    this.httpServer = new HttpServer();
  }

  public async initialize(): Promise<void> {
    console.log('Initializing application...');
    this.httpServer.registerRoutes();
    console.log('Routes registered');
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