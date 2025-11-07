import { EventHandler } from '../../../../shared/domain/event-handler';
import { UserMentionedNotificationEvent } from '../../domain/events/user-mentioned-notification.event';
import { PostMentionReadRepository } from '../../domain/interfaces/post-mention-read-repository.interface';
import { PostReadRepository } from '../../domain/interfaces/post-read-repository.interface';
import { UserReadRepository } from '../../../user/domain/interfaces/user-read-repository.interface';
import { PostMentionReadModel } from '../../domain/interfaces/post-mention-read-model.interface';
import { Timestamps } from '../../../../shared/domain/datetime';

export class UserMentionedReadModelEventHandler implements EventHandler<UserMentionedNotificationEvent> {
  constructor(
    private mentionReadRepository: PostMentionReadRepository,
    private postReadRepository: PostReadRepository,
    private userReadRepository: UserReadRepository
  ) {}

  async handle(event: UserMentionedNotificationEvent): Promise<void> {
    console.log(`Syncing mention ${event.mentionId} to read model`);

    try {
      const post = await this.postReadRepository.findById(event.postId);
      
      if (!post) {
        console.warn(`Post ${event.postId} not found, cannot sync mention to read model`);
        return;
      }

      const mentionedUser = await this.userReadRepository.findById(event.mentionedUserId);
      
      if (!mentionedUser) {
        console.warn(`Mentioned user ${event.mentionedUserId} not found`);
        return;
      }

      const mentionerUser = await this.userReadRepository.findById(event.mentionerUserId);
      
      if (!mentionerUser) {
        console.warn(`Mentioner user ${event.mentionerUserId} not found`);
        return;
      }

      const mentionReadModel: PostMentionReadModel = {
        id: event.mentionId,
        postId: event.postId,
        mentionedUserId: event.mentionedUserId,
        mentionerUserId: event.mentionerUserId,
        
        post: {
          id: post.id,
          content: post.content,
          createdAt: post.timestamps.createdAt.toDate()
        },

        mentionedUser: {
          id: mentionedUser.id,
          username: mentionedUser.userName,
          firstName: mentionedUser.firstName,
          lastName: mentionedUser.lastName,
          profileImageUrl: undefined
        },

        mentionerUser: {
          id: mentionerUser.id,
          username: mentionerUser.userName,
          firstName: mentionerUser.firstName,
          lastName: mentionerUser.lastName,
          profileImageUrl: undefined
        },

        isRead: false,

        engagementStats: {
          likesCount: post.likesCount || 0,
          commentsCount: 0
        },

        timestamps: Timestamps.create()
      };

      await this.mentionReadRepository.save(mentionReadModel);

      console.log(`Mention ${event.mentionId} synced to read model successfully`);

    } catch (error) {
      console.error(`Error syncing mention ${event.mentionId} to read model:`, error);
    }
  }
}
