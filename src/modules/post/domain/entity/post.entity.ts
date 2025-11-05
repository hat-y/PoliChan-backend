import { Timestamps } from "../../../../shared/domain/datetime"
import { DomainEvent } from "../../../../shared/domain/event";

export class Post {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly content: string,
    public readonly likesCount: number,
    public readonly timestamps: Timestamps,
  ) { }

  // named constructor => factory method
  public static create(
    id: string,
    userId: string,
    content: string,
  ): Post {
    return new Post(id, userId, content, 0, Timestamps.create())
  }

  public updatePost(newContent: string): Post {
    return new Post(this.id, this.userId, newContent, this.likesCount, this.timestamps.update())
  }

  public delete(): Post {
    return new Post(
      this.id,
      this.userId,
      this.content,
      this.likesCount,
      this.timestamps.delete()
    );
  }

  // TODO likes in a other modules
  public like(): Post {
    const likedPost = new Post(
      this.id,
      this.userId,
      this.content,
      this.likesCount + 1,
      this.timestamps.update()
    );
    return likedPost;
  }

  public unlike(): Post {
    return new Post(
      this.id,
      this.userId,
      this.content,
      Math.max(0, this.likesCount - 1),
      this.timestamps.update()
    );
  }

  // serialize
  public toJSON(): { id: string; userId: string; content: string; likesCount: number; timestamps: Timestamps; } {
    return {
      id: this.id,
      userId: this.userId,
      content: this.content,
      likesCount: this.likesCount,
      timestamps: this.timestamps
    };
  }
}

// Identify different events
export class PostCreatedEvent extends DomainEvent {
  constructor(
    eventId: string,
    public readonly postId: string,
    public readonly userId: string,
    public readonly content: string,
    public readonly likesCount: number
  ) {
    super(eventId, postId, 'PostCreated')
  }
}

export class PostUpdatedEvent extends DomainEvent {
  constructor(
    eventId: string,
    public readonly postId: string,
    public readonly userId: string,
    public readonly content: string,
    public readonly likesCount: number
  ) {
    super(eventId, postId, 'PostUpdated')
  }
}

export class PostDeletedEvent extends DomainEvent {
  constructor(
    eventId: string, public readonly postId: string
  ) {
    super(eventId, postId, 'PostDeleted');
  }
}

// ==== created a other module for a Like events ====
export class LikeCreatedEvent extends DomainEvent {
  constructor(
    eventId: string,
    public readonly postId: string,
    public readonly userId: string
  ) {
    super(eventId, postId, 'LikeCreated')
  }
}

export class LikeRemovedEvent extends DomainEvent {
  constructor(
    eventId: string,
    public readonly postId: string,
    public readonly userId: string
  ) {
    super(eventId, postId, 'LikeRemoved')
  }
}
