import { QueryHandler } from '../../../../shared/domain/query-handler';
import { GetPostMentionsQuery } from '../queries/get-post-mentions.query';
import { PostMentionReadRepository } from '../../domain/interfaces/post-mention-read-repository.interface';

export class GetPostMentionsQueryHandler implements QueryHandler<GetPostMentionsQuery> {
  constructor(
    private mentionReadRepository: PostMentionReadRepository
  ) {}

  async handle(query: GetPostMentionsQuery): Promise<any[]> {
    console.log(`Getting mentions for post ${query.postId}`);

    try {
      // 1. Obtener menciones del post
      const mentions = await this.mentionReadRepository.getPostMentions({
        postId: query.postId,
        limit: query.limit || 50,
        offset: query.offset || 0
      });

      console.log(`Found ${mentions.length} mentions for post ${query.postId}`);

      // 2. Formatear para la respuesta API
      const formattedMentions = mentions.map(mention => ({
        id: mention.id,
        mentionedUser: mention.mentionedUser ? {
          id: mention.mentionedUser.id,
          username: mention.mentionedUser.username,
          firstName: mention.mentionedUser.firstName,
          lastName: mention.mentionedUser.lastName,
          profileImageUrl: mention.mentionedUser.profileImageUrl
        } : null,
        mentionedBy: mention.mentionerUser ? {
          id: mention.mentionerUser.id,
          username: mention.mentionerUser.username,
          firstName: mention.mentionerUser.firstName,
          lastName: mention.mentionerUser.lastName,
          profileImageUrl: mention.mentionerUser.profileImageUrl
        } : null,
        createdAt: mention.timestamps.createdAt.toDate()
      }));

      return formattedMentions;

    } catch (error) {
      console.error(`Error getting mentions for post ${query.postId}:`, error);
      throw new Error('Failed to get post mentions');
    }
  }
}