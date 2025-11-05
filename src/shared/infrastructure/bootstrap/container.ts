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

// Post module imports
import { CreatePostCommand } from '../../../modules/post/application/commands/create-post.command';
import { DeletePostCommand } from '../../../modules/post/application/commands/delete-post.command';
import { LikePostCommand } from '../../../modules/post/application/commands/like-post.command';
import { UnlikePostCommand } from '../../../modules/post/application/commands/unlike-post.command';
import { CreatePostCommandHandler } from '../../../modules/post/application/handlers/create-post-command.handler';
import { DeletePostCommandHandler } from '../../../modules/post/application/handlers/delete-post-command.handler';
import { LikePostCommandHandler } from '../../../modules/post/application/handlers/like-post-command.handler';
import { UnlikePostCommandHandler } from '../../../modules/post/application/handlers/unlike-post-command.handler';
import { FindPostQuery } from '../../../modules/post/application/queries/find-post.query';
import { GetAllPostsQuery } from '../../../modules/post/application/queries/get-all-posts.query';
import { FindPostsByUserQuery } from '../../../modules/post/application/queries/find-posts-by-user.query';
import { GetTimelineQuery } from '../../../modules/post/application/queries/get-timeline.query';
import { GetUserTimelineQuery } from '../../../modules/post/application/queries/get-user-timeline.query';
import { GetMostLikedPostsQuery } from '../../../modules/post/application/queries/get-most-liked-posts.query';
import { FindPostsByLikesRangeQuery } from '../../../modules/post/application/queries/find-posts-by-likes-range.query';
import { FindPostQueryHandler } from '../../../modules/post/application/handlers/find-post-query.handler';
import { GetAllPostsQueryHandler } from '../../../modules/post/application/handlers/get-all-posts-query.handler';
import { FindPostsByUserQueryHandler } from '../../../modules/post/application/handlers/find-posts-by-user-query.handler';
import { GetTimelineQueryHandler } from '../../../modules/post/application/handlers/get-timeline-query.handler';
import { GetUserTimelineQueryHandler } from '../../../modules/post/application/handlers/get-user-timeline-query.handler';
import { GetMostLikedPostsQueryHandler } from '../../../modules/post/application/handlers/get-most-liked-posts-query.handler';
import { FindPostsByLikesRangeQueryHandler } from '../../../modules/post/application/handlers/find-posts-by-likes-range-query.handler';
import { PostgresPostWriteRepository } from '../../../modules/post/infrastructure/repositories/postgres-post-write.repository';
import { MongoPostReadRepository } from '../../../modules/post/infrastructure/repositories/mongo-post-read.repository';
import { PostCreatedEvent } from '../../../modules/post/domain/entity/post.entity';
import { PostDeletedEvent } from '../../../modules/post/domain/entity/post.entity';
import { LikeCreatedEvent } from '../../../modules/post/domain/entity/post.entity';
import { LikeRemovedEvent } from '../../../modules/post/domain/entity/post.entity';
import { PostCreatedEventHandler } from '../../../modules/post/application/event-handlers/post-created.event-handler';
import { PostDeletedEventHandler } from '../../../modules/post/application/event-handlers/post-deleted.event-handler';
import { LikeCreatedEventHandler } from '../../../modules/post/application/event-handlers/like-created.event-handler';
import { LikeRemovedEventHandler } from '../../../modules/post/application/event-handlers/like-removed.event-handler';
import { HttpServer } from '../http/http.server';
import { WebSocketUserEventBroadcaster } from '../../../modules/user/application/broadcasting/websocket-user-event-broadcaster';
import { GetAllUsersQuery } from '../../../modules/user/application/queries/get-all-users.query';
import { FindUserQuery } from '../../../modules/user/application/queries/find-user.query';
import { LoginUserQueryHandler } from '../../../modules/user/application/handlers/login-user-query.handler';
import { LoginUserQuery } from '../../../modules/user/application/queries/login-user.query';

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
    // User module repositories
    const userWriteRepository = new PostgresUserWriteRepository(
      this.writeDatabase
    );
    const userReadRepository = new MongoUserReadRepository(this.readDatabase);

    // Instancia única del broadcaster WebSocket
    const broadcaster = new WebSocketUserEventBroadcaster(() =>
      this.httpServer.getWebSocketServer()
    );

    // Post module repositories
    const postWriteRepository = new PostgresPostWriteRepository(
      this.writeDatabase
    );
    const postReadRepository = new MongoPostReadRepository(this.readDatabase);

    // ===== USER COMMAND HANDLERS =====
    this.messageBus.registerCommandHandler(
      'RegisterUserCommand',
      new RegisterUserCommandHandler(userWriteRepository, this.messageBus)
    );

    this.messageBus.registerCommandHandler(
      'UpdateUserCommand',
      new UpdatedUserCommandHandler(userWriteRepository, this.messageBus)
    );

    // ===== POST COMMAND HANDLERS =====
    this.messageBus.registerCommandHandler(
      CreatePostCommand.name,
      new CreatePostCommandHandler(postWriteRepository, this.messageBus)
    );

    this.messageBus.registerCommandHandler(
      DeletePostCommand.name,
      new DeletePostCommandHandler(postWriteRepository, this.messageBus)
    );

    this.messageBus.registerCommandHandler(
      LikePostCommand.name,
      new LikePostCommandHandler(postWriteRepository, this.messageBus)
    );

    this.messageBus.registerCommandHandler(
      UnlikePostCommand.name,
      new UnlikePostCommandHandler(postWriteRepository, this.messageBus)
    );

    // ===== USER QUERY HANDLERS =====
    this.messageBus.registerQueryHandler(
      FindUserQuery.name,
      new FindUserQueryHandler(userReadRepository)
    );

    this.messageBus.registerQueryHandler(
      GetAllUsersQuery.name,
      new GetAllUsersQueryHandler(userReadRepository)
    );

    this.messageBus.registerQueryHandler(
      LoginUserQuery.name,
      new LoginUserQueryHandler(userReadRepository)
    );

    // ===== POST QUERY HANDLERS =====
    this.messageBus.registerQueryHandler(
      FindPostQuery.name,
      new FindPostQueryHandler(postReadRepository)
    );

    this.messageBus.registerQueryHandler(
      GetAllPostsQuery.name,
      new GetAllPostsQueryHandler(postReadRepository)
    );

    this.messageBus.registerQueryHandler(
      FindPostsByUserQuery.name,
      new FindPostsByUserQueryHandler(postReadRepository)
    );

    this.messageBus.registerQueryHandler(
      GetTimelineQuery.name,
      new GetTimelineQueryHandler(postReadRepository)
    );

    this.messageBus.registerQueryHandler(
      GetUserTimelineQuery.name,
      new GetUserTimelineQueryHandler(postReadRepository)
    );

    this.messageBus.registerQueryHandler(
      GetMostLikedPostsQuery.name,
      new GetMostLikedPostsQueryHandler(postReadRepository)
    );

    this.messageBus.registerQueryHandler(
      FindPostsByLikesRangeQuery.name,
      new FindPostsByLikesRangeQueryHandler(postReadRepository)
    );

    // ===== USER EVENT HANDLERS =====
    this.messageBus.registerEventHandler('UserRegisteredEvent', [
      new UserRegisteredEventHandler(userReadRepository, broadcaster),
    ]);

    this.messageBus.registerEventHandler('UserUpdatedEvent', [
      new UserUpdatedEventHandler(userReadRepository),
    ]);

    // ===== POST EVENT HANDLERS =====
    this.messageBus.registerEventHandler(PostCreatedEvent.name, [
      new PostCreatedEventHandler(postReadRepository),
    ]);

    this.messageBus.registerEventHandler(PostDeletedEvent.name, [
      new PostDeletedEventHandler(postReadRepository),
    ]);

    this.messageBus.registerEventHandler(LikeCreatedEvent.name, [
      new LikeCreatedEventHandler(postReadRepository),
    ]);

    this.messageBus.registerEventHandler(LikeRemovedEvent.name, [
      new LikeRemovedEventHandler(postReadRepository),
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
