import { EventHandler } from '../../../../shared/domain/event-handler';
import { CommentUnlikedEvent } from '../../domain/entity/comments.entity';
import { CommentsReadModel } from '../../domain/interfaces/comments-read-model.interface';
import { CommentsReadRepository } from '../../domain/interfaces/comments-read-repository.interface';
import { CommentEventBroadcaster } from '../broadcasting/interfaces/comment-event-broadcaster.interface';

export class CommentUnlikedEventHandler implements EventHandler<CommentUnlikedEvent> {
  constructor(
    private commentReadRepository: CommentsReadRepository,
    private commentEventBroadcaster: CommentEventBroadcaster
  ) { }

  async handle(event: CommentUnlikedEvent): Promise<void> {
    console.log('CommentUnlikedEventHandler received event:', event);

    const existingComment = await this.commentReadRepository.findById(event.commentId);

    if (!existingComment) {
      throw new Error(`Comment with id ${event.commentId} not found in read model`);
    }

    const newLikesCount = Math.max(0, existingComment.likesCount - 1);

    const updatedComment: CommentsReadModel = {
      ...existingComment,
      likes: existingComment.likes.filter(id => id !== event.userId),
      likesCount: newLikesCount,
      timestamps: existingComment.timestamps.update()
    };

    await this.commentReadRepository.update(updatedComment);

    this.commentEventBroadcaster.broadcastCommentUnliked(event);

    console.log(`Comment ${event.commentId} unliked by user ${event.userId} and broadcasted`);
  }
}
