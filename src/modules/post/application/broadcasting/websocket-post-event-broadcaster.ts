import {
  LikeCreatedEvent,
  PostCreatedEvent,
} from '../../domain/entity/post.entity';
import { PostEventBroadcaster } from './interfaces/post-event-broadcaster.interface';

export class WebSocketPostEventBroadcaster implements PostEventBroadcaster {
  constructor(private getWebSocketServer: () => any[]) {}

  broadcastPostCreated(event: PostCreatedEvent): void {
    const sockets = this.getWebSocketServer();
    if (sockets && sockets.length > 0) {
      sockets.forEach((socket: any) => {
        if (socket.readyState === socket.OPEN) {
          socket.send(
            JSON.stringify({
              type: 'post-created',
              data: {
                postId: event.postId,
                userId: event.userId,
                content: event.content,
                likesCount: event.likes.length,
                occurredAt: event.occurredAt,
              },
            })
          );
        }
      });
    }
  }
  broadcastLikeCreated(event: LikeCreatedEvent): void {
    const sockets = this.getWebSocketServer();
    if (sockets && sockets.length > 0) {
      sockets.forEach((socket: any) => {
        if (socket.readyState === socket.OPEN) {
          socket.send(
            JSON.stringify({
              type: 'like-created',
              data: {
                postId: event.postId,
                userId: event.userId,
                occurredAt: event.occurredAt,
              },
            })
          );
        }
      });
    }
  }
}
