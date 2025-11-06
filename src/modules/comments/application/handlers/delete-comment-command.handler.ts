import { CommandHandler } from '../../../../shared/domain/command-handler';
import { MessageBus } from '../../../../shared/domain/message-bus';
import { CommentsWriteRepository } from '../../domain/interfaces/comments-write-repository.interface';
import { DeleteCommentCommand } from '../commands/delete-comment.command';

export class DeleteCommentCommandHandler implements CommandHandler<DeleteCommentCommand> {
  constructor(
    private commentsRepository: CommentsWriteRepository,
    private messageBus: MessageBus
  ) { }

  async handle(command: DeleteCommentCommand): Promise<void> {
    const existingComment = await this.commentsRepository.findByIdForValidation(command.commentId);

    if (!existingComment) {
      throw new Error('Comment not found');
    }

    // Verificar que el usuario que intenta eliminar es el dueño del comentario
    if (existingComment.userId !== command.userId) {
      throw new Error('User not authorized to delete this comment');
    }

    const { comment: deletedComment, event } = existingComment.delete();

    await this.commentsRepository.save(deletedComment);

    // Publicar evento de comentario eliminado
    this.messageBus.publishEventAsync(event);
  }
}