import { QueryHandler } from '../../../../shared/domain/query-handler';
import { PostReadRepository } from '../../domain/interfaces/post-read-repository.interface';
import { PostReadModel } from '../../domain/interfaces/post-read-model.interface';
import { GetAllPostsQuery } from '../queries/get-all-posts.query';

export class GetAllPostsQueryHandler implements QueryHandler<GetAllPostsQuery, PostReadModel[]> {
  constructor(private postReadRepository: PostReadRepository) {}

  async handle(query: GetAllPostsQuery): Promise<PostReadModel[]> {
    return await this.postReadRepository.findAll(query.limit, query.offset);
  }
}