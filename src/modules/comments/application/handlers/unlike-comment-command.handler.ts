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
    const existingComment = await this.commentsRepository.findByIdForValidation(command.commentId);

    if (!existingComment) {
      throw new Error('Comment not found');
    }

    const { comment: unlikedComment, event } = existingComment.unlike(command.userId);

    await this.commentsRepository.save(unlikedComment);

    // Solo publicar evento si hay cambios (el usuario había dado like antes)
    if (event) {
      this.messageBus.publishEventAsync(event);
    }
  }
}