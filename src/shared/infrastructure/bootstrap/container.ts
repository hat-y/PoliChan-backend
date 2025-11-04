import { UserRegisteredEventHandler } from '../../../modules/user/application/event-handlers/user-registered.event-handler';
import { UserUpdatedEventHandler } from '../../../modules/user/application/event-handlers/user-updated.event-handler';
import { FindUserQueryHandler } from '../../../modules/user/application/handlers/find-user-query.handler';
import { GetAllUsersQueryHandler } from '../../../modules/user/application/handlers/get-all-user-query.handler';
import { RegisterUserCommandHandler } from '../../../modules/user/application/handlers/register-user-command.handler';
import { MongoUserReadRepository } from '../../../modules/user/infrastructure/repositories/mongo-user-read.repository';
import { PostgresUserWriteRepository } from '../../../modules/user/infrastructure/repositories/postgres-user-write.repository';
import { MessageBus } from '../../domain/message-bus';
import { InMemoryMessageBus } from '../in-memory-message-bus';
import { ReadDatabase } from '../mongo/read-database';
import { WriteDatabase } from '../postgres/write-database';
import { UpdatedUserCommandHandler } from '../../../modules/user/application/handlers/update-user-command.handler';
import { LoginUserQueryHandler } from '../../../modules/user/application/handlers/login-user-query.handler';
import { HttpServer } from '../http/http.server';

// Importa la interfaz y la implementación de broadcasting
import { WebSocketUserEventBroadcaster } from '../../../modules/user/application/broadcasting/websocket-user-event-broadcaster';

export class Container {
  public messageBus: MessageBus;
  public writeDatabase: WriteDatabase;
  public readDatabase: ReadDatabase;
  public httpServer: HttpServer;

  constructor() {
    this.messageBus = new InMemoryMessageBus();
    this.writeDatabase = new WriteDatabase();
    this.readDatabase = new ReadDatabase();
    this.httpServer = new HttpServer(this.messageBus);
  }

  public async initiliaze(): Promise<void> {
    await this.writeDatabase.initialize();
    await this.readDatabase.initialize();
    this.registerHandlers();
  }

  public registerHandlers(): void {
    const userWriteRepository = new PostgresUserWriteRepository(
      this.writeDatabase
    );
    const userReadRepository = new MongoUserReadRepository(this.readDatabase);

    // Instancia única del broadcaster WebSocket
    const broadcaster = new WebSocketUserEventBroadcaster(() =>
      this.httpServer.getWebSocketServer()
    );

    this.messageBus.registerCommandHandler(
      'RegisterUserCommand',
      new RegisterUserCommandHandler(userWriteRepository, this.messageBus)
    );

    this.messageBus.registerCommandHandler(
      'UpdateUserCommand',
      new UpdatedUserCommandHandler(userWriteRepository, this.messageBus)
    );

    this.messageBus.registerQueryHandler(
      'FindUserByIdQuery',
      new FindUserQueryHandler(userReadRepository)
    );

    this.messageBus.registerQueryHandler(
      'GetAllUsersQuery',
      new GetAllUsersQueryHandler(userReadRepository)
    );

    this.messageBus.registerQueryHandler(
      'LoginUserQuery',
      new LoginUserQueryHandler(userReadRepository)
    );

    // Usa el broadcaster en el event handler
    this.messageBus.registerEventHandler('UserRegisteredEvent', [
      new UserRegisteredEventHandler(userReadRepository, broadcaster),
    ]);

    this.messageBus.registerEventHandler('UserUpdatedEvent', [
      new UserUpdatedEventHandler(userReadRepository),
    ]);
  }

  public async cleanup(): Promise<void> {
    console.log('Cleaning up resources...');

    await this.messageBus.drainEventQueue();

    await this.writeDatabase.close();
    await this.readDatabase.close();

    console.log('Cleanup completed.');
  }
}
