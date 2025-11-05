import { Timestamps } from '../../../../shared/domain/datetime';
import { DomainEvent } from '../../../../shared/domain/event';

export class Post {
  public readonly likes: string[];
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly content: string,
    likes: string[],
    public readonly timestamps: Timestamps
  ) {
    this.likes = likes;
  }

  // named constructor => factory method
  public static create(id: string, userId: string, content: string): Post {
    return new Post(id, userId, content, [], Timestamps.create());
  }

  public updatePost(newContent: string): Post {
    return new Post(
      this.id,
      this.userId,
      newContent,
      this.likes,
      this.timestamps.update()
    );
  }

  public delete(): Post {
    return new Post(
      this.id,
      this.userId,
      this.content,
      this.likes,
      this.timestamps.delete()
    );
  }

  public like(userId: string): Post {
    if (this.likes.includes(userId)) return this;
    return new Post(
      this.id,
      this.userId,
      this.content,
      [...this.likes, userId],
      this.timestamps.update()
    );
  }

  public unlike(userId: string): Post {
    return new Post(
      this.id,
      this.userId,
      this.content,
      this.likes.filter((id) => id !== userId),
      this.timestamps.update()
    );
  }

  get likesCount(): number {
    return this.likes.length;
  }

  // serialize
  public toJSON(): {
    id: string;
    userId: string;
    content: string;
    likes: string[];
    likesCount: number;
    timestamps: Timestamps;
  } {
    return {
      id: this.id,
      userId: this.userId,
      content: this.content,
      likes: this.likes,
      likesCount: this.likesCount,
      timestamps: this.timestamps,
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
    public readonly likes: string[]
  ) {
    super(eventId, postId, 'PostCreated');
  }
}

export class PostUpdatedEvent extends DomainEvent {
  constructor(
    eventId: string,
    public readonly postId: string,
    public readonly userId: string,
    public readonly content: string,
    public readonly likes: string[]
  ) {
    super(eventId, postId, 'PostUpdated');
  }
}

export class PostDeletedEvent extends DomainEvent {
  constructor(eventId: string, public readonly postId: string) {
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
    super(eventId, postId, 'LikeCreated');
  }
}

export class LikeRemovedEvent extends DomainEvent {
  constructor(
    eventId: string,
    public readonly postId: string,
    public readonly userId: string
  ) {
    super(eventId, postId, 'LikeRemoved');
  }
}
