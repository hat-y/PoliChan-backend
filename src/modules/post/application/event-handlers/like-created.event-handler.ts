import { EventHandler } from '../../../../shared/domain/event-handler';
import { LikeCreatedEvent } from '../../domain/entity/post.entity';
import { PostReadRepository } from '../../domain/interfaces/post-read-repository.interface';
import { UpdatedAt } from '../../../../shared/domain/datetime';

export class LikeCreatedEventHandler implements EventHandler<LikeCreatedEvent> {
  constructor(
    private postReadRepository: PostReadRepository
  ) { }

  async handle(event: LikeCreatedEvent): Promise<void> {
    console.log('LikeCreatedEventHandler received event:', event);

    const existingPost = await this.postReadRepository.findById(event.postId);

    if (!existingPost) {
      throw new Error(`Post with id ${event.postId} not found in read model`);
    }

    const updatedPost = {
      ...existingPost,
      likesCount: existingPost.likesCount + 1,
      timestamps: {
        ...existingPost.timestamps,
        updatedAt: UpdatedAt.now()
      }
    };

    await this.postReadRepository.update(updatedPost);
  }
}
