import { EventHandler } from '../../../../shared/domain/event-handler';
import { CommentsUpdatedEvent } from '../../domain/entity/comments.entity';
import { CommentsReadModel } from '../../domain/interfaces/comments-read-model.interface';
import { CommentsReadRepository } from '../../domain/interfaces/comments-read-repository.interface';
import { CommentEventBroadcaster } from '../broadcasting/interfaces/comment-event-broadcaster.interface';

export class CommentUpdatedEventHandler implements EventHandler<CommentsUpdatedEvent> {
  constructor(
    private commentReadRepository: CommentsReadRepository,
    private commentEventBroadcaster: CommentEventBroadcaster
  ) { }

  async handle(event: CommentsUpdatedEvent): Promise<void> {
    console.log('CommentUpdatedEventHandler received event:', event);

    const existingComment = await this.commentReadRepository.findById(event.commentId);

    if (!existingComment) {
      throw new Error(`Comment with id ${event.commentId} not found in read model`);
    }

    const updatedComment: CommentsReadModel = {
      ...existingComment,
      content: event.content,
      timestamps: existingComment.timestamps.update()
    };

    await this.commentReadRepository.save(updatedComment);

    this.commentEventBroadcaster.broadcastCommentUpdated(event);

    console.log(`Comment ${event.commentId} content updated and broadcasted`);
  }
}
