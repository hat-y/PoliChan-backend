import { CommandHandler } from '../../../../shared/domain/command-handler';
import { MessageBus } from '../../../../shared/domain/message-bus';
import { Comments } from '../../domain/entity/comments.entity';
import { CommentsWriteRepository } from '../../domain/interfaces/comments-write-repository.interface';
import { CreateCommentCommand } from '../commands/create-comment.command';
import { v4 } from 'uuid';

export class CreateCommentCommandHandler implements CommandHandler<CreateCommentCommand> {
  constructor(
    private commentsRepository: CommentsWriteRepository,
    private messageBus: MessageBus
  ) { }

  async handle(command: CreateCommentCommand): Promise<void> {
    const { comment, event } = Comments.create(
      v4(),
      command.postId,
      command.userId,
      command.content
    );

    await this.commentsRepository.save(comment);

    console.log('About to publish event:', event);
    console.log('Event type:', event.eventType);
    console.log('Event name:', event.constructor.name);
    this.messageBus.publishEventAsync(event);
    console.log('Event published successfully');
  }
}
