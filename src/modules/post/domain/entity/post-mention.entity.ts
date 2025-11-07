import { Timestamps } from "../../../../shared/domain/datetime";
import { DomainEvent } from "../../../../shared/domain/event";
import { randomUUID } from "crypto";

export class PostMention {
  constructor(
    public readonly id: string,
    public readonly postId: string,
    public readonly mentionedUserId: string,
    public readonly mentionerUserId: string,
    public readonly timestamps: Timestamps
  ) {}

  public static create(
    postId: string,
    mentionedUserId: string,
    mentionerUserId: string
  ): { mention: PostMention } {
    const mentionId = randomUUID();

    const mention = new PostMention(
      mentionId,
      postId,
      mentionedUserId,
      mentionerUserId,
      Timestamps.create()
    );

    return { mention };
  }

  public isValid(): boolean {
    if (this.mentionedUserId === this.mentionerUserId) {
      return false;
    }

    if (!this.postId || !this.mentionedUserId || !this.mentionerUserId) {
      return false;
    }

    return true;
  }

  public involvesUser(userId: string): boolean {
    return this.mentionedUserId === userId || this.mentionerUserId === userId;
  }

  public toJSON(): {
    id: string;
    postId: string;
    mentionedUserId: string;
    mentionerUserId: string;
    timestamps: Timestamps;
  } {
    return {
      id: this.id,
      postId: this.postId,
      mentionedUserId: this.mentionedUserId,
      mentionerUserId: this.mentionerUserId,
      timestamps: this.timestamps
    };
  }
}

// Events específicos para menciones (útil para futuro)
export class PostMentionCreatedEvent extends DomainEvent {
  constructor(
    eventId: string,
    public readonly mentionId: string,
    public readonly postId: string,
    public readonly mentionedUserId: string,
    public readonly mentionerUserId: string
  ) {
    super(eventId, mentionId, 'PostMentionCreated');
  }
}

export class PostMentionReadEvent extends DomainEvent {
  constructor(
    eventId: string,
    public readonly mentionId: string,
    public readonly mentionedUserId: string,
    public readonly readerUserId: string
  ) {
    super(eventId, mentionId, 'PostMentionRead');
  }
}