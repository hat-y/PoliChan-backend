import { DomainEvent } from "../../../../shared/domain/event";

// Evento separado de PostMentionCreatedEvent para notificaciones al usuario
// Permite retries independientes y diferentes handlers
export class UserMentionedNotificationEvent extends DomainEvent {
  constructor(
    eventId: string,
    public readonly mentionedUserId: string,     // Usuario que fue mencionado
    public readonly postId: string,              // Post donde se mencionó
    public readonly mentionerUserId: string,     // Usuario que hizo la mención
    public readonly mentionId: string            // ID de la entidad PostMention
  ) {
    super(eventId, mentionId, 'UserMentionedNotification');
  }

  public shouldNotifyUser(userId: string): boolean {
    return this.mentionedUserId === userId;
  }

  public getUsersInvolved(): string[] {
    return [this.mentionedUserId, this.mentionerUserId];
  }
}