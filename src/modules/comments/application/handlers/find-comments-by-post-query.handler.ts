import { QueryHandler } from '../../../../shared/domain/query-handler';
import { CommentsReadRepository } from '../../domain/interfaces/comments-read-repository.interface';
import { CommentsReadModel } from '../../domain/interfaces/comments-read-model.interface';
import { FindCommentsByPostQuery } from '../queries/find-comments-by-post.query';

export class FindCommentsByPostQueryHandler implements QueryHandler<FindCommentsByPostQuery, CommentsReadModel[]> {
  constructor(private commentsReadRepository: CommentsReadRepository) {}

  async handle(query: FindCommentsByPostQuery): Promise<CommentsReadModel[]> {
    return await this.commentsReadRepository.findWithUserByPostId(query.postId);
  }
}