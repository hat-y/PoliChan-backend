import { EventHandler } from '../../../../shared/domain/event-handler';
import { PostDeletedEvent } from '../../domain/entity/post.entity';
import { PostReadRepository } from '../../domain/interfaces/post-read-repository.interface';
import { PostReadModel } from '../../domain/interfaces/post-read-model.interface';

export class PostDeletedEventHandler implements EventHandler<PostDeletedEvent> {
  constructor(
    private postReadRepository: PostReadRepository
  ) { }

  async handle(event: PostDeletedEvent): Promise<void> {
    console.log('PostDeletedEventHandler received event:', event);

    const existingPost = await this.postReadRepository.findById(event.postId);

    if (!existingPost) {
      throw new Error(`Post with id ${event.postId} not found in read model`);
    }

    const updatedTimestamps = existingPost.timestamps.delete();

    const updatedPost: PostReadModel = {
      ...existingPost,
      timestamps: updatedTimestamps
    };

    await this.postReadRepository.update(updatedPost);
  }
}
