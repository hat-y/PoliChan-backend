import { EventHandler } from '../../../../shared/domain/event-handler';
import { CommentLikedEvent } from '../../domain/entity/comments.entity';
import { CommentsReadModel } from '../../domain/interfaces/comments-read-model.interface';
import { CommentsReadRepository } from '../../domain/interfaces/comments-read-repository.interface';

export class CommentLikedEventHandler implements EventHandler<CommentLikedEvent> {
  constructor(
    private commentReadRepository: CommentsReadRepository
  ) { }

  async handle(event: CommentLikedEvent): Promise<void> {
    console.log('CommentLikedEventHandler received event:', event);

    const existingComment = await this.commentReadRepository.findById(event.commentId);

    if (!existingComment) {
      throw new Error(`Comment with id ${event.commentId} not found in read model`);
    }

    if (existingComment.user && existingComment.user.id === event.userId) {
      console.log('User cannot like their own comment');
      return;
    }

    const updatedComment: CommentsReadModel = {
      ...existingComment,
      likesCount: existingComment.likesCount + 1,
      timestamps: existingComment.timestamps.update()
    };

    await this.commentReadRepository.save(updatedComment);

    console.log(`Comment ${event.commentId} liked by user ${event.userId}`);
  }
}
