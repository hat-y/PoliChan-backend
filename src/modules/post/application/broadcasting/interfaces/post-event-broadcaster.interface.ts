import {
  LikeCreatedEvent,
  PostCreatedEvent,
} from '../../../domain/entity/post.entity';

export interface PostEventBroadcaster {
  broadcastPostCreated(event: PostCreatedEvent): void;
  broadcastLikeCreated(event: LikeCreatedEvent): void;
}
