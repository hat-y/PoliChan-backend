import { QueryHandler } from '../../../../shared/domain/query-handler';
import { PostReadRepository } from '../../domain/interfaces/post-read-repository.interface';
import { PostReadModel } from '../../domain/interfaces/post-read-model.interface';
import { FindPostsByUserQuery } from '../queries/find-posts-by-user.query';

export class FindPostsByUserQueryHandler implements QueryHandler<FindPostsByUserQuery, PostReadModel[]> {
  constructor(private postReadRepository: PostReadRepository) {}

  async handle(query: FindPostsByUserQuery): Promise<PostReadModel[]> {
    return await this.postReadRepository.findByUserId(query.userId);
  }
}