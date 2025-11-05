import { PostController } from './presentation/controllers/post.controller';
import { MessageBus } from '../../shared/domain/message-bus';

export class PostModule {
  private static postController: PostController;

  public static initialize(messageBus: MessageBus): PostController {
    this.postController = new PostController(messageBus);
    return this.postController;
  }

  public static getPostController(): PostController {
    if (!this.postController) {
      throw new Error('PostModule not initialized. Call initialize() first.');
    }
    return this.postController;
  }
}