import { EventHandler } from '../../../../shared/domain/event-handler';
import { CommentsCreatedEvent } from '../../domain/entity/comments.entity';
import { CommentsReadRepository } from '../../domain/interfaces/comments-read-repository.interface';
import { CommentsReadModel } from '../../domain/interfaces/comments-read-model.interface';
import { UserReadRepository } from '../../../user/domain/interfaces/user-read-repository.interface';
import { Timestamps, CreatedAt, UpdatedAt } from '../../../../shared/domain/datetime';
import { CommentEventBroadcaster } from '../broadcasting/interfaces/comment-event-broadcaster.interface';

export class CommentCreatedEventHandler implements EventHandler<CommentsCreatedEvent> {
  constructor(
    private commentReadRepository: CommentsReadRepository,
    private userReadRepository: UserReadRepository,
    private commentEventBroadcaster: CommentEventBroadcaster
  ) { }

  async handle(event: CommentsCreatedEvent): Promise<void> {
    console.log('CommentCreatedEventHandler received event:', event);

    const user = await this.userReadRepository.findById(event.userId);

    const timestamps = new Timestamps(
      CreatedAt.from(event.occurredAt),
      UpdatedAt.from(event.occurredAt),
      undefined
    );

    const commentReadModel: CommentsReadModel = {
      id: event.commentId,
      postId: event.postId,
      userId: event.userId,
      content: event.content,
      likes: event.likes,
      likesCount: event.likes.length,
      timestamps: timestamps,
      user: user
        ? {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.userName,
        }
        : undefined,
    };

    await this.commentReadRepository.save(commentReadModel);

    this.commentEventBroadcaster.broadcastCommentCreated(event);

    console.log(`Comment ${event.commentId} saved to read model and broadcasted`);
  }
}
