import { QueryHandler } from '../../../../shared/domain/query-handler';
import { GetMentionCountQuery } from '../queries/get-mention-count.query';
import { PostMentionReadRepository } from '../../domain/interfaces/post-mention-read-repository.interface';

export class GetMentionCountQueryHandler implements QueryHandler<GetMentionCountQuery> {
  constructor(
    private mentionReadRepository: PostMentionReadRepository
  ) {}

  async handle(query: GetMentionCountQuery): Promise<any> {
    console.log(`Getting mention count for user ${query.userId}`);

    try {
      // 1. Obtener conteo total de menciones
      const totalCount = await this.mentionReadRepository.countUserMentions(
        query.userId,
        query.includeRead || false
      );

      // 2. Obtener conteo de menciones no leídas (para badges/notifications)
      const unreadCount = query.includeRead
        ? await this.mentionReadRepository.findUnreadCount(query.userId)
        : totalCount;

      console.log(`Mention counts for user ${query.userId}:`, {
        total: totalCount,
        unread: unreadCount
      });

      return {
        totalMentions: totalCount,
        unreadMentions: unreadCount,
        userId: query.userId
      };

    } catch (error) {
      console.error(`Error getting mention count for user ${query.userId}:`, error);
      throw new Error('Failed to get mention count');
    }
  }
}