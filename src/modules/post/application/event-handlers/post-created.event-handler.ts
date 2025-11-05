import { EventHandler } from '../../../../shared/domain/event-handler';
import { UserReadRepository } from '../../../user/domain/interfaces/user-read-repository.interface';
import { PostCreatedEvent } from '../../domain/entity/post.entity';
import { PostReadRepository } from '../../domain/interfaces/post-read-repository.interface';
import { PostReadModel } from '../../domain/interfaces/post-read-model.interface';
import { Timestamps, CreatedAt, UpdatedAt } from '../../../../shared/domain/datetime';

export class PostCreatedEventHandler implements EventHandler<PostCreatedEvent> {
  constructor(
    private postReadRepository: PostReadRepository,
    private userReadRepository: UserReadRepository
  ) { }

  async handle(event: PostCreatedEvent): Promise<void> {
    console.log('PostCreatedEventHandler received event:', event);

    const user = await this.userReadRepository.findById(event.userId)

    const timestamps = new Timestamps(
      CreatedAt.from(event.occurredAt),
      UpdatedAt.from(event.occurredAt),
      undefined
    );

    const postReadModel: PostReadModel = {
      id: event.postId,
      userId: event.userId,
      content: event.content,
      likesCount: event.likesCount,
      timestamps: timestamps,
      user: user ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.userName
      } : undefined
    };

    await this.postReadRepository.save(postReadModel);
  }
}
