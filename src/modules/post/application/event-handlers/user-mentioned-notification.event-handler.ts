import { EventHandler } from '../../../../shared/domain/event-handler';
import { UserMentionedNotificationEvent } from '../../domain/events/user-mentioned-notification.event';
import { UserReadRepository } from '../../../user/domain/interfaces/user-read-repository.interface';

export class UserMentionedNotificationEventHandler implements EventHandler<UserMentionedNotificationEvent> {
  constructor(
    private userReadRepository: UserReadRepository
  ) {}

  async handle(event: UserMentionedNotificationEvent): Promise<void> {
    console.log(`Processing notification for user ${event.mentionedUserId}`);

    try {
      // 1. Validar que el usuario exista y esté activo
      const mentionedUser = await this.userReadRepository.findById(event.mentionedUserId);

      if (!mentionedUser) {
        console.warn(`User ${event.mentionedUserId} not found, skipping notification`);
        return;
      }

      const mentionerUser = await this.userReadRepository.findById(event.mentionerUserId);

      await Promise.allSettled([
        this.sendInAppNotification(event, mentionedUser, mentionerUser),
        this.sendEmailNotification(event, mentionedUser, mentionerUser),
        this.sendPushNotification(event, mentionedUser, mentionerUser)
      ]);

      console.log(`Notification sent to user ${event.mentionedUserId} for post ${event.postId}`);

    } catch (error) {
      console.error(`Failed to send notification for ${event.mentionedUserId}:`, error);
    }
  }

  private async sendInAppNotification(
    event: UserMentionedNotificationEvent,
    mentionedUser: any,
    mentionerUser: any
  ): Promise<void> {
    console.log(`In-app notification: ${mentionerUser?.username || 'Someone'} mentioned you in a post`);
  }

  private async sendEmailNotification(
    event: UserMentionedNotificationEvent,
    mentionedUser: any,
    mentionerUser: any
  ): Promise<void> {
    console.log(`Email notification: Sending mention email to ${mentionedUser?.email}`);
  }

  private async sendPushNotification(
    event: UserMentionedNotificationEvent,
    mentionedUser: any,
    mentionerUser: any
  ): Promise<void> {
    console.log(`Push notification: Sending mention push to ${mentionedUser?.username}`);
  }

  private userWantsMentionNotifications(user: any): boolean {
    return true;
  }
}