import { CommentsController } from './presentation/controllers/comments.controller';
import { MessageBus } from '../../shared/domain/message-bus';

export class CommentsModule {
  static initialize(messageBus: MessageBus): CommentsController {
    return new CommentsController(messageBus);
  }
}