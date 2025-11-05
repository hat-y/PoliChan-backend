import { EventHandler } from '../../../../shared/domain/event-handler';
import { PostDeletedEvent } from '../../domain/entity/post.entity';
import { PostReadRepository } from '../../domain/interfaces/post-read-repository.interface';
import { DeletedAt, UpdatedAt } from '../../../../shared/domain/datetime';

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

    const updatedPost = {
      ...existingPost,
      timestamps: {
        ...existingPost.timestamps,
        updatedAt: UpdatedAt.now(),
        deletedAt: DeletedAt.now()
      }
    };

    await this.postReadRepository.update(updatedPost);
  }
}
