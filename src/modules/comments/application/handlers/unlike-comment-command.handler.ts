import { CommandHandler } from '../../../../shared/domain/command-handler';
import { MessageBus } from '../../../../shared/domain/message-bus';
import { CommentsWriteRepository } from '../../domain/interfaces/comments-write-repository.interface';
import { UnlikeCommentCommand } from '../commands/unlike-comment.command';

export class UnlikeCommentCommandHandler implements CommandHandler<UnlikeCommentCommand> {
  constructor(
    private commentsRepository: CommentsWriteRepository,
    private messageBus: MessageBus
  ) { }

  async handle(command: UnlikeCommentCommand): Promise<void> {
    console.log('UnlikeCommentCommandHandler handling command:', {
      commentId: command.commentId,
      userId: command.userId
    });

    const existingComment = await this.commentsRepository.findByIdForValidation(command.commentId);

    if (!existingComment) {
      throw new Error('Comment not found');
    }

    // Check if user actually liked the comment before unliking
    if (!existingComment.likes.includes(command.userId)) {
      console.log(`User ${command.userId} has not liked comment ${command.commentId}, skipping unlike`);
      return; // No throw error, just return without changes
    }

    const { comment: unlikedComment, event } = existingComment.unlike(command.userId);

    await this.commentsRepository.save(unlikedComment);

    if (event) {
      await this.messageBus.publishEventAsync(event);
      console.log(`Comment ${command.commentId} unliked by user ${command.userId} successfully`);
    } else {
      console.log(`No event generated for unlike operation on comment ${command.commentId}`);
    }
  }
}
