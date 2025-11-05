import { QueryHandler } from '../../../../shared/domain/query-handler';
import { PostReadRepository } from '../../domain/interfaces/post-read-repository.interface';
import { PostReadModel } from '../../domain/interfaces/post-read-model.interface';
import { GetTimelineQuery } from '../queries/get-timeline.query';

export class GetTimelineQueryHandler implements QueryHandler<GetTimelineQuery, PostReadModel[]> {
  constructor(private postReadRepository: PostReadRepository) {}

  async handle(query: GetTimelineQuery): Promise<PostReadModel[]> {
    return await this.postReadRepository.findTimeline(query.afterPostId, query.limit);
  }
}