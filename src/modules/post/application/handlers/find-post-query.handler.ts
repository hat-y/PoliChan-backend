import { QueryHandler } from '../../../../shared/domain/query-handler';
import { PostReadRepository } from '../../domain/interfaces/post-read-repository.interface';
import { PostReadModel } from '../../domain/interfaces/post-read-model.interface';
import { FindPostQuery } from '../queries/find-post.query';

export class FindPostQueryHandler implements QueryHandler<FindPostQuery, PostReadModel | null> {
  constructor(private postReadRepository: PostReadRepository) {}

  async handle(query: FindPostQuery): Promise<PostReadModel | null> {
    return await this.postReadRepository.findById(query.postId);
  }
}