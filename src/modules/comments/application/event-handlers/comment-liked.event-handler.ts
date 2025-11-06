import { EventHandler } from '../../../../shared/domain/event-handler';
import { CommentLikedEvent } from '../../domain/entity/comments.entity';
import { CommentsReadModel } from '../../domain/interfaces/comments-read-model.interface';
import { CommentsReadRepository } from '../../domain/interfaces/comments-read-repository.interface';
import { CommentEventBroadcaster } from '../broadcasting/interfaces/comment-event-broadcaster.interface';

export class CommentLikedEventHandler implements EventHandler<CommentLikedEvent> {
  constructor(
    private commentReadRepository: CommentsReadRepository,
    private commentEventBroadcaster: CommentEventBroadcaster
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

    const updatedLikes = existingComment.likes.includes(event.userId)
      ? existingComment.likes
      : [...existingComment.likes, event.userId];

    const updatedTimestamps = existingComment.timestamps.update();

    const updatedComment: CommentsReadModel = {
      ...existingComment,
      likes: updatedLikes,
      likesCount: updatedLikes.length,
      timestamps: updatedTimestamps,
    };

    try {
      await this.commentReadRepository.save(updatedComment);
      console.log('Comment saved to MongoDB successfully');
    } catch (error) {
      console.log('MongoDB duplicate error, trying to update instead:', error);
      try {
        await this.commentReadRepository.update(updatedComment);
        console.log('Comment updated to MongoDB successfully');
      } catch (updateError) {
        console.error('Failed to update MongoDB:', updateError);
      }
    }

    this.commentEventBroadcaster.broadcastCommentLiked(event);

    console.log(`Comment ${event.commentId} liked by user ${event.userId} and broadcasted`);
  }
}
