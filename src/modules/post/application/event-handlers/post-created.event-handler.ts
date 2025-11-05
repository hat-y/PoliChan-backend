import { EventHandler } from '../../../../shared/domain/event-handler';
import { PostCreatedEvent, Post } from '../../domain/entity/post.entity';
import { PostReadRepository } from '../../domain/interfaces/post-read-repository.interface';
import { Timestamps, CreatedAt, UpdatedAt } from '../../../../shared/domain/datetime';

export class PostCreatedEventHandler implements EventHandler<PostCreatedEvent> {
  constructor(
    private postReadRepository: PostReadRepository
  ) { }

  async handle(event: PostCreatedEvent): Promise<void> {
    console.log('PostCreatedEventHandler received event:', event);

    const post = Post.create(
      event.postId,
      event.userId,
      event.content
    );

    const postReadModel = {
      id: post.id,
      userId: post.userId,
      content: post.content,
      likesCount: post.likesCount,
      timestamps: post.timestamps
    };

    await this.postReadRepository.save(postReadModel);
  }
}
