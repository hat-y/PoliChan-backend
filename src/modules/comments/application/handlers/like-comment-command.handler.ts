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
    const existingComment = await this.commentsRepository.findByIdForValidation(command.commentId);

    if (!existingComment) {
      throw new Error('Comment not found');
    }

    const { comment: likedComment, event } = existingComment.like(command.userId);

    await this.commentsRepository.save(likedComment);

    // Solo publicar evento si hay cambios (el usuario no había dado like antes)
    if (event) {
      this.messageBus.publishEventAsync(event);
    }
  }
}
