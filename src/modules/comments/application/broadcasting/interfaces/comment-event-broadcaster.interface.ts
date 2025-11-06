import {
  CommentsCreatedEvent,
  CommentsUpdatedEvent,
  CommentsDeletedEvent,
  CommentLikedEvent,
  CommentUnlikedEvent,
} from "../../../domain/entity/comments.entity";

export interface CommentWebSocketMessage {
  type: 'comment-created' | 'comment-updated' | 'comment-deleted' | 'comment-liked' | 'comment-unliked';
  data: CommentWebSocketData;
  timestamp: string;
}

export interface CommentWebSocketData {
  commentId: string;
  postId: string;
  userId?: string;
  content?: string;
  likesCount?: number;
  occurredAt: string;
}

export enum WebSocketReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

export interface CommentWebSocket {
  readyState: WebSocketReadyState;
  send(data: string): void;
  close(): void;
  onopen: ((event: Event) => void) | null;
  onclose: ((event: CloseEvent) => void) | null;
  onmessage: ((event: MessageEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
}

export interface CommentEventBroadcaster {
  broadcastCommentCreated(event: CommentsCreatedEvent): void;
  broadcastCommentUpdated(event: CommentsUpdatedEvent): void;
  broadcastCommentDeleted(event: CommentsDeletedEvent): void;
  broadcastCommentLiked(event: CommentLikedEvent): void;
  broadcastCommentUnliked(event: CommentUnlikedEvent): void;
}
