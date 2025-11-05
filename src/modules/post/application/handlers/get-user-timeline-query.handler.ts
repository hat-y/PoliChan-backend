import { QueryHandler } from '../../../../shared/domain/query-handler';
import { PostReadRepository } from '../../domain/interfaces/post-read-repository.interface';
import { PostReadModel } from '../../domain/interfaces/post-read-model.interface';
import { GetUserTimelineQuery } from '../queries/get-user-timeline.query';

export class GetUserTimelineQueryHandler implements QueryHandler<GetUserTimelineQuery, PostReadModel[]> {
  constructor(private postReadRepository: PostReadRepository) {}

  async handle(query: GetUserTimelineQuery): Promise<PostReadModel[]> {
    return await this.postReadRepository.findUserTimeline(
      query.userId,
      query.afterPostId,
      query.limit
    );
  }
}