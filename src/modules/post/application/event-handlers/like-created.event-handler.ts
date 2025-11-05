import { EventHandler } from '../../../../shared/domain/event-handler';
import { LikeCreatedEvent } from '../../domain/entity/post.entity';
import { PostReadRepository } from '../../domain/interfaces/post-read-repository.interface';
import { PostReadModel } from '../../domain/interfaces/post-read-model.interface';
import { Timestamps, UpdatedAt } from '../../../../shared/domain/datetime';
import { PostEventBroadcaster } from '../broadcasting/interfaces/post-event-broadcaster.interface';
export class LikeCreatedEventHandler implements EventHandler<LikeCreatedEvent> {
  constructor(
    private postReadRepository: PostReadRepository,
    private broadcaster: PostEventBroadcaster // <-- nuevo parámetro
  ) {}

  async handle(event: LikeCreatedEvent): Promise<void> {
    console.log('LikeCreatedEventHandler received event:', event);

    const existingPost = await this.postReadRepository.findById(event.postId);

    if (!existingPost) {
      throw new Error(`Post with id ${event.postId} not found in read model`);
    }

    const updatedLikes = existingPost.likes.includes(event.userId)
      ? existingPost.likes
      : [...existingPost.likes, event.userId];

    const updatedTimestamps = existingPost.timestamps.update();
    console.log('oaaaaaa');
    const updatedPost: PostReadModel = {
      ...existingPost,
      likes: updatedLikes,
      likesCount: updatedLikes.length,
      timestamps: updatedTimestamps,
    };

    await this.postReadRepository.update(updatedPost);

    // Emitir evento por WebSocket
    this.broadcaster.broadcastLikeCreated(event);
  }
}
