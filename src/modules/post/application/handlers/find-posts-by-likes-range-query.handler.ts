import { QueryHandler } from '../../../../shared/domain/query-handler';
import { PostReadRepository } from '../../domain/interfaces/post-read-repository.interface';
import { PostReadModel } from '../../domain/interfaces/post-read-model.interface';
import { FindPostsByLikesRangeQuery } from '../queries/find-posts-by-likes-range.query';

export class FindPostsByLikesRangeQueryHandler implements QueryHandler<FindPostsByLikesRangeQuery, PostReadModel[]> {
  constructor(private postReadRepository: PostReadRepository) {}

  async handle(query: FindPostsByLikesRangeQuery): Promise<PostReadModel[]> {
    return await this.postReadRepository.findByLikesRange(
      query.minLikes,
      query.maxLikes,
      query.limit
    );
  }
}