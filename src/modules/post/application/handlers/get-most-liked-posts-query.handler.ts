import { QueryHandler } from '../../../../shared/domain/query-handler';
import { PostReadRepository } from '../../domain/interfaces/post-read-repository.interface';
import { PostReadModel } from '../../domain/interfaces/post-read-model.interface';
import { GetMostLikedPostsQuery } from '../queries/get-most-liked-posts.query';

export class GetMostLikedPostsQueryHandler implements QueryHandler<GetMostLikedPostsQuery, PostReadModel[]> {
  constructor(private postReadRepository: PostReadRepository) {}

  async handle(query: GetMostLikedPostsQuery): Promise<PostReadModel[]> {
    return await this.postReadRepository.findMostLiked(query.limit);
  }
}