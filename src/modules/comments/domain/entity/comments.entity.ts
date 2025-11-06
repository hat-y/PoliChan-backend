import { Timestamps } from "../../../../shared/domain/datetime";
import { DomainEvent } from "../../../../shared/domain/event";

export class Comments {
  constructor(
    public readonly id: string,
    public readonly postId: string,
    public readonly userId: string,
    private readonly _likes: string[],
    public readonly content: string,
    public readonly timestamps: Timestamps
  ) {
    this._likes = _likes;
  }

  public static create(
    id: string,
    postId: string,
    userId: string,
    content: string
  ): { comment: Comments; event: CommentsCreatedEvent } {
    const comment = new Comments(id, postId, userId, [], content, Timestamps.create());
    const eventId = `event_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

    const event = new CommentsCreatedEvent(
      eventId,
      id,
      postId,
      userId,
      content,
      []
    );

    return { comment, event };
  }

  public updatePost(newContent: string): { comment: Comments; event: CommentsUpdatedEvent } {
    if (this.content === newContent) {
      throw new Error('Content must be different to update');
    }

    const updatedComment = new Comments(
      this.id,
      this.postId,
      this.userId,
      this._likes,
      newContent,
      this.timestamps.update()
    );

    const eventId = `event_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    const event = new CommentsUpdatedEvent(
      eventId,
      this.id,
      this.postId,
      this.userId,
      newContent,
      this._likes
    );

    return { comment: updatedComment, event };
  }

  public delete(): { comment: Comments; event: CommentsDeletedEvent } {
    const deletedComment = new Comments(
      this.id,
      this.postId,
      this.userId,
      this._likes,
      this.content,
      this.timestamps.delete()
    );

    const eventId = `event_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    const event = new CommentsDeletedEvent(eventId, this.id, this.postId);

    return { comment: deletedComment, event };
  }

  public like(userId: string): { comment: Comments; event?: CommentLikedEvent } {
    if (this._likes.includes(userId)) {
      return { comment: this };
    }

    const likedComment = new Comments(
      this.id,
      this.postId,
      this.userId,
      [...this._likes, userId],
      this.content,
      this.timestamps.update()
    );

    const eventId = `event_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    const event = new CommentLikedEvent(eventId, this.id, this.postId, userId);

    return { comment: likedComment, event };
  }

  public unlike(userId: string): { comment: Comments; event?: CommentUnlikedEvent } {
    console.log(`Comments.unlike called for comment ${this.id} by user ${userId}`);
    console.log(`Current likes:`, this._likes);

    if (!this._likes.includes(userId)) {
      console.log(`User ${userId} has not liked comment ${this.id}, returning without changes`);
      return { comment: this }; // No hay cambios, no hay evento
    }

    const unlikedComment = new Comments(
      this.id,
      this.postId,
      this.userId,
      this._likes.filter((id: string): boolean => id !== userId),
      this.content,
      this.timestamps.update()
    );

    const eventId = `event_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    const event = new CommentUnlikedEvent(eventId, this.id, this.postId, userId);

    console.log(`Created CommentUnlikedEvent:`, { eventId, commentId: this.id, userId });
    console.log(`Updated likes count:`, unlikedComment.likesCount);

    return { comment: unlikedComment, event };
  }

  get likes(): string[] {
    return [...this._likes];
  }

  get likesCount(): number {
    return this._likes.length;
  }

  // serialize
  public toJSON(): {
    id: string;
    postId: string;
    userId: string;
    content: string;
    likes: string[];
    likesCount: number;
    timestamps: Timestamps;
  } {
    return {
      id: this.id,
      postId: this.postId,
      userId: this.userId,
      content: this.content,
      likes: this.likes,
      likesCount: this.likesCount,
      timestamps: this.timestamps
    };
  }
}

// === EVENTS DEFINITIONS ====

export class CommentsCreatedEvent extends DomainEvent {
  constructor(
    eventId: string,
    public readonly commentId: string,
    public readonly postId: string,
    public readonly userId: string,
    public readonly content: string,
    public readonly likes: string[]
  ) {
    super(eventId, commentId, 'CommentCreated')
  }
}

export class CommentsUpdatedEvent extends DomainEvent {
  constructor(
    eventId: string,
    public readonly commentId: string,
    public readonly postId: string,
    public readonly userId: string,
    public readonly content: string,
    public readonly likes: string[]
  ) {
    super(eventId, commentId, 'CommentUpdated')
  }
}

export class CommentsDeletedEvent extends DomainEvent {
  constructor(
    eventId: string,
    public readonly commentId: string,
    public readonly postId: string
  ) {
    super(eventId, commentId, 'CommentDeleted')
  }
}

export class CommentLikedEvent extends DomainEvent {
  constructor(
    eventId: string,
    public readonly commentId: string,
    public readonly postId: string,
    public readonly userId: string
  ) {
    super(eventId, commentId, 'CommentLiked')
  }
}

export class CommentUnlikedEvent extends DomainEvent {
  constructor(
    eventId: string,
    public readonly commentId: string,
    public readonly postId: string,
    public readonly userId: string
  ) {
    super(eventId, commentId, 'CommentUnliked')
  }
}
