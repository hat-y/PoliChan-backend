import { QueryHandler } from '../../../../shared/domain/query-handler';
import { GetUserMentionsQuery } from '../queries/get-user-mentions.query';
import { PostMentionReadRepository } from '../../domain/interfaces/post-mention-read-repository.interface';

export class GetUserMentionsQueryHandler implements QueryHandler<GetUserMentionsQuery, any[]> {
  constructor(
    private mentionReadRepository: PostMentionReadRepository
  ) {}

  async handle(query: GetUserMentionsQuery): Promise<any[]> {
    console.log(`Getting mentions for user ${query.userId}`, {
      limit: query.limit,
      offset: query.offset,
      includeRead: query.includeRead
    });

    try {

      const mentions = await this.mentionReadRepository.getUserMentions({
        userId: query.userId,
        limit: query.limit || 20,
        offset: query.offset || 0,
        includeRead: query.includeRead || false,
        fromDate: query.fromDate,
        toDate: query.toDate
      });

      console.log(`Found ${mentions.length} mentions for user ${query.userId}`);

      const formattedMentions = mentions.map(mention => ({
        id: mention.id,
        post: mention.post ? {
          id: mention.post.id,
          content: this.truncateContent(mention.post.content, 200),
          createdAt: mention.post.createdAt
        } : null,
        mentionedBy: mention.mentionerUser ? {
          id: mention.mentionerUser.id,
          username: mention.mentionerUser.username,
          firstName: mention.mentionerUser.firstName,
          lastName: mention.mentionerUser.lastName,
          profileImageUrl: mention.mentionerUser.profileImageUrl
        } : null,
        isRead: mention.isRead || false,
        createdAt: mention.timestamps.createdAt.toDate(),
        engagementStats: mention.engagementStats || {
          likesCount: 0,
          commentsCount: 0
        }
      }));

      return formattedMentions;

    } catch (error) {
      console.error(`Error getting mentions for user ${query.userId}:`, error);
      throw new Error('Failed to get user mentions');
    }
  }

  private truncateContent(content: string, maxLength: number): string {
    if (content.length <= maxLength) {
      return content;
    }

    return content.substring(0, maxLength).trim() + '...';
  }
}