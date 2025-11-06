import {
  CommentsCreatedEvent,
  CommentsUpdatedEvent,
  CommentsDeletedEvent,
  CommentLikedEvent,
  CommentUnlikedEvent,
} from '../../domain/entity/comments.entity';
import { CommentEventBroadcaster, CommentWebSocket, CommentWebSocketMessage, WebSocketReadyState } from './interfaces/comment-event-broadcaster.interface';

export class WebSocketCommentEventBroadcaster implements CommentEventBroadcaster {
  constructor(private getWebSocketServer: () => CommentWebSocket[]) { }

  private broadcastMessage(message: CommentWebSocketMessage): void {
    const sockets = this.getWebSocketServer();

    if (!sockets || sockets.length === 0) {
      console.log('No WebSocket connections available for broadcasting');
      return;
    }

    let sentCount = 0;

    sockets.forEach((socket: CommentWebSocket): void => {
      if (socket.readyState === WebSocketReadyState.OPEN) {
        try {
          socket.send(JSON.stringify(message));
          sentCount++;
        } catch (error) {
          console.error('Error sending WebSocket message:', error);
        }
      }
    });

    console.log(`Broadcasted ${message.type} message to ${sentCount} WebSocket clients`);
  }

  broadcastCommentCreated(event: CommentsCreatedEvent): void {
    const message: CommentWebSocketMessage = {
      type: 'comment-created',
      data: {
        commentId: event.commentId,
        postId: event.postId,
        userId: event.userId,
        content: event.content,
        likesCount: event.likes.length,
        occurredAt: event.occurredAt.toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    this.broadcastMessage(message);
  }

  broadcastCommentUpdated(event: CommentsUpdatedEvent): void {
    const message: CommentWebSocketMessage = {
      type: 'comment-updated',
      data: {
        commentId: event.commentId,
        postId: event.postId,
        userId: event.userId,
        content: event.content,
        likesCount: event.likes.length,
        occurredAt: event.occurredAt.toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    this.broadcastMessage(message);
  }

  broadcastCommentDeleted(event: CommentsDeletedEvent): void {
    const message: CommentWebSocketMessage = {
      type: 'comment-deleted',
      data: {
        commentId: event.commentId,
        postId: event.postId,
        occurredAt: event.occurredAt.toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    this.broadcastMessage(message);
  }

  broadcastCommentLiked(event: CommentLikedEvent): void {
    const message: CommentWebSocketMessage = {
      type: 'comment-liked',
      data: {
        commentId: event.commentId,
        postId: event.postId,
        userId: event.userId,
        occurredAt: event.occurredAt.toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    this.broadcastMessage(message);
  }

  broadcastCommentUnliked(event: CommentUnlikedEvent): void {
    const message: CommentWebSocketMessage = {
      type: 'comment-unliked',
      data: {
        commentId: event.commentId,
        postId: event.postId,
        userId: event.userId,
        occurredAt: event.occurredAt.toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    this.broadcastMessage(message);
  }
}
