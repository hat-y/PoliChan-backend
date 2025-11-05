import { EventHandler } from '../../../../shared/domain/event-handler';
import { PostCreatedEvent } from '../../domain/entity/post.entity';
import { PostReadRepository } from '../../domain/interfaces/post-read-repository.interface';

export class PostCreatedEventHandler implements EventHandler<PostCreatedEvent> {
  constructor(
    private postReadRepository: PostReadRepository
  ) { }

  async handle(event: PostCreatedEvent): Promise<void> {
    console.log('PostCreatedEventHandler received event:', event);

    const postReadModel = {
      id: event.postId,
      userId: event.userId,
      content: event.content,
      likesCount: event.likesCount,
      timestamps: {
        createdAt: event.occurredAt,
        updatedAt: event.occurredAt,
        deletedAt: null
      }
    };

    await this.postReadRepository.save(postReadModel);
  }
}
