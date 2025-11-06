import { EventHandler } from '../../../../shared/domain/event-handler';
import { CommentsDeletedEvent } from '../../domain/entity/comments.entity';
import { CommentsReadRepository } from '../../domain/interfaces/comments-read-repository.interface';

export class CommentDeletedEventHandler implements EventHandler<CommentsDeletedEvent> {
  constructor(
    private commentReadRepository: CommentsReadRepository
  ) { }

  async handle(event: CommentsDeletedEvent): Promise<void> {
    console.log('CommentDeletedEventHandler received event:', event);

    await this.commentReadRepository.delete(event.commentId);

    console.log(`Comment ${event.commentId} deleted from read model`);
  }
}
