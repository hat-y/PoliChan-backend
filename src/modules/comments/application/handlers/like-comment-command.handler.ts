import { CommandHandler } from '../../../../shared/domain/command-handler';
import { MessageBus } from '../../../../shared/domain/message-bus';
import { CommentsWriteRepository } from '../../domain/interfaces/comments-write-repository.interface';
import { LikeCommentCommand } from '../commands/like-comment.command';

export class LikeCommentCommandHandler implements CommandHandler<LikeCommentCommand> {
  constructor(
    private commentsRepository: CommentsWriteRepository,
    private messageBus: MessageBus
  ) { }

  async handle(command: LikeCommentCommand): Promise<void> {
    console.log('LikeCommentCommandHandler received:', command);

    const existingComment = await this.commentsRepository.findByIdForValidation(command.commentId);

    if (!existingComment) {
      throw new Error('Comment not found');
    }

    console.log('Existing comment found:', existingComment.id);

    const { comment: likedComment, event } = existingComment.like(command.userId);

    console.log('Like result - Event generated:', !!event);
    if (event) {
      console.log('Event details:', event);
    }

    await this.commentsRepository.save(likedComment);
    console.log('Comment saved to PostgreSQL');

    if (event) {
      console.log('Publishing event async...');
      this.messageBus.publishEventAsync(event);
      console.log('Event published');
    } else {
      console.log('No event to publish (user already liked)');
    }
  }
}
