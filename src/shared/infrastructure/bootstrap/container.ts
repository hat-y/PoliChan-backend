import { HttpServer } from '../http/http.server';
import { MessageBus } from '../../domain/message-bus';
import { InMemoryMessageBus } from '../in-memory-message-bus';
import { ReadDatabase } from '../mongo/read-database';
import { WriteDatabase } from '../postgres/write-database';

// User module commands imports
import {
  FindUserQueryHandler,
  GetAllUsersQueryHandler,
  LoginUserQueryHandler,
  RegisterUserCommandHandler,
  UpdatedUserCommandHandler,
} from '../../../modules/user/application/handlers';

// User module queries imports
import {
  GetAllUsersQuery,
  FindUserQuery,
  LoginUserQuery,
} from '../../../modules/user/application/queries';

// User module event handlers imports
import {
  UserRegisteredEventHandler,
  UserUpdatedEventHandler,
} from '../../../modules/user/application/event-handlers/';

// User module repositories imports
import {
  MongoUserReadRepository,
  PostgresUserWriteRepository,
} from '../../../modules/user/infrastructure/repositories';

// Post module commands imports
import {
  CreatePostCommand,
  DeletePostCommand,
  LikePostCommand,
  UnlikePostCommand,
} from '../../../modules/post/application/commands';

// Post module queries imports
import {
  GetUserMentionsQuery,
  FindPostsByLikesRangeQuery,
  FindPostsByUserQuery,
  FindPostQuery,
  GetAllPost,
  GetAllPostsQuery,
  GetMentionCountQuery,
  GetMostLikedPostsQuery,
  GetPostMentionsQuery,
  GetTimelineQuery,
  GetUserTimelineQuery,
} from '../../../modules/post/application/queries';

// Post module handlers imports
import {
  FindPostQueryHandler,
  CreatePostCommandHandler,
  DeletePostCommandHandler,
  FindPostsByLikesRangeQueryHandler,
  FindPostsByUserQueryHandler,
  GetAllPostsQueryHandler,
  GetMentionCountQueryHandler,
  GetMostLikedPostsQueryHandler,
  GetPostMentionsQueryHandler,
  GetTimelineQueryHandler,
  GetUserMentionsQueryHandler,
  LikePostCommandHandler,
  UnlikePostCommandHandler,
  GetUserTimelineQueryHandler,
} from '../../../modules/post/application/handlers';

// Post domain events imports
import {
  PostCreatedEvent,
  LikeCreatedEvent,
  LikeRemovedEvent,
  PostDeletedEvent,
  PostUpdatedEvent,
} from '../../../modules/post/domain/entity/post.entity';

// Post module event handlers imports
import {
  PostCreatedEventHandler,
  LikeCreatedEventHandler,
  LikeRemovedEventHandler,
  PostCreatedForMentionsEventHandler,
  PostDeletedEventHandler,
  UserMentionedNotificationEventHandler,
  UserMentionedReadModelEventHandler,
} from '../../../modules/post/application/event-handlers';

import { WebSocketUserEventBroadcaster } from '../../../modules/user/application/broadcasting/websocket-user-event-broadcaster';
import { WebSocketPostEventBroadcaster } from '../../../modules/post/application/broadcasting/websocket-post-event-broadcaster';
import { WebSocketCommentEventBroadcaster } from '../../../modules/comments/application/broadcasting/websocket-comment-event-broadcaster';

// Post module repositories imports
import {
  PostgresPostMentionWriteRepository,
  MongoPostMentionReadRepository,
  MongoPostReadRepository,
  PostgresPostWriteRepository,
} from '../../../modules/post/infrastructure/repositories';

// Post module services imports
import { ContentProcessorService } from '../../../modules/post/domain/services/content-processor.service';
import { UserMentionedNotificationEvent } from '../../../modules/post/domain/events/user-mentioned-notification.event';

// Comments module commands imports
import {
  CreateCommentCommand,
  DeleteCommentCommand,
  LikeCommentCommand,
  UnlikeCommentCommand,
} from '../../../modules/comments/application/commands';

// Comments module queries imports
import {
  FindCommentQuery,
  CountCommentsByPostQuery,
  FindCommentsByPostQuery,
} from '../../../modules/comments/application/queries';

// Comments module handlers imports
import {
  UnlikeCommentCommandHandler,
  CountCommentsByPostQueryHandler,
  CreateCommentCommandHandler,
  DeleteCommentCommandHandler,
  FindCommentQueryHandler,
  FindCommentsByPostQueryHandler,
  LikeCommentCommandHandler,
} from '../../../modules/comments/application/handlers';

// Comments module repositories imports
import {
  PostgresCommentsWriteRepository,
  MongoCommentsReadRepository,
} from '../../../modules/comments/infrastructure/repositories';

// Comments domain events imports
import {
  CommentsCreatedEvent,
  CommentsUpdatedEvent,
  CommentsDeletedEvent,
  CommentLikedEvent,
  CommentUnlikedEvent,
} from '../../../modules/comments/domain/entity/comments.entity';

// Comments event handlers imports
import {
  CommentLikedEventHandler,
  CommentCreatedEventHandler,
  CommentDeletedEventHandler,
  CommentUnlikedEventHandler,
  CommentUpdatedEventHandler,
} from '../../../modules/comments/application/event-handlers';

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

    const postBroadcaster = new WebSocketPostEventBroadcaster(() =>
      this.httpServer.getWebSocketServer()
    );

    const commentBroadcaster = new WebSocketCommentEventBroadcaster(() =>
      this.httpServer.getWebSocketServer()
    );

    // Post module repositories
    const postWriteRepository = new PostgresPostWriteRepository(
      this.writeDatabase
    );
    const postReadRepository = new MongoPostReadRepository(this.readDatabase);

    // Comments module repositories
    const commentWriteRepository = new PostgresCommentsWriteRepository(
      this.writeDatabase
    );
    const commentReadRepository = new MongoCommentsReadRepository(
      this.readDatabase
    );

    // Post Mentions module repositories
    const postMentionWriteRepository = new PostgresPostMentionWriteRepository(
      this.writeDatabase
    );
    const postMentionReadRepository = new MongoPostMentionReadRepository(
      this.readDatabase
    );

    // Services
    const contentProcessor = new ContentProcessorService(userWriteRepository);

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

    // ===== COMMENTS COMMAND HANDLERS =====
    this.messageBus.registerCommandHandler(
      CreateCommentCommand.name,
      new CreateCommentCommandHandler(commentWriteRepository, this.messageBus)
    );

    this.messageBus.registerCommandHandler(
      DeleteCommentCommand.name,
      new DeleteCommentCommandHandler(commentWriteRepository, this.messageBus)
    );

    this.messageBus.registerCommandHandler(
      LikeCommentCommand.name,
      new LikeCommentCommandHandler(commentWriteRepository, this.messageBus)
    );

    this.messageBus.registerCommandHandler(
      UnlikeCommentCommand.name,
      new UnlikeCommentCommandHandler(commentWriteRepository, this.messageBus)
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

    // ===== COMMENTS QUERY HANDLERS =====
    this.messageBus.registerQueryHandler(
      FindCommentQuery.name,
      new FindCommentQueryHandler(commentReadRepository)
    );

    this.messageBus.registerQueryHandler(
      FindCommentsByPostQuery.name,
      new FindCommentsByPostQueryHandler(commentReadRepository)
    );

    this.messageBus.registerQueryHandler(
      CountCommentsByPostQuery.name,
      new CountCommentsByPostQueryHandler(commentReadRepository)
    );

    // ===== POST MENTIONS QUERY HANDLERS =====
    this.messageBus.registerQueryHandler(
      GetUserMentionsQuery.name,
      new GetUserMentionsQueryHandler(postMentionReadRepository)
    );

    this.messageBus.registerQueryHandler(
      GetMentionCountQuery.name,
      new GetMentionCountQueryHandler(postMentionReadRepository)
    );

    this.messageBus.registerQueryHandler(
      GetPostMentionsQuery.name,
      new GetPostMentionsQueryHandler(postMentionReadRepository)
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
      new PostCreatedEventHandler(
        postReadRepository,
        userReadRepository,
        postBroadcaster
      ),
      new PostCreatedForMentionsEventHandler(
        contentProcessor,
        postMentionWriteRepository,
        this.messageBus
      ),
    ]);

    this.messageBus.registerEventHandler(PostDeletedEvent.name, [
      new PostDeletedEventHandler(postReadRepository),
    ]);

    this.messageBus.registerEventHandler(LikeCreatedEvent.name, [
      new LikeCreatedEventHandler(postReadRepository, postBroadcaster),
    ]);

    this.messageBus.registerEventHandler(LikeRemovedEvent.name, [
      new LikeRemovedEventHandler(postReadRepository),
    ]);

    // ===== COMMENTS EVENT HANDLERS =====
    this.messageBus.registerEventHandler(CommentsCreatedEvent.name, [
      new CommentCreatedEventHandler(
        commentReadRepository,
        userReadRepository,
        commentBroadcaster
      ),
    ]);

    this.messageBus.registerEventHandler(CommentsUpdatedEvent.name, [
      new CommentUpdatedEventHandler(commentReadRepository, commentBroadcaster),
    ]);

    this.messageBus.registerEventHandler(CommentsDeletedEvent.name, [
      new CommentDeletedEventHandler(commentReadRepository, commentBroadcaster),
    ]);

    this.messageBus.registerEventHandler(CommentLikedEvent.name, [
      new CommentLikedEventHandler(commentReadRepository, commentBroadcaster),
    ]);

    this.messageBus.registerEventHandler(CommentUnlikedEvent.name, [
      new CommentUnlikedEventHandler(commentReadRepository, commentBroadcaster),
    ]);

    // ===== POST MENTIONS EVENT HANDLERS =====
    this.messageBus.registerEventHandler(UserMentionedNotificationEvent.name, [
      new UserMentionedNotificationEventHandler(userReadRepository),
      new UserMentionedReadModelEventHandler(
        postMentionReadRepository,
        postReadRepository,
        userReadRepository
      ),
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
