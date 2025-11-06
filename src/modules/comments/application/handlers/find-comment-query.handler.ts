import { QueryHandler } from '../../../../shared/domain/query-handler';
import { CommentsReadRepository } from '../../domain/interfaces/comments-read-repository.interface';
import { CommentsReadModel } from '../../domain/interfaces/comments-read-model.interface';
import { FindCommentQuery } from '../queries/find-comment.query';

export class FindCommentQueryHandler implements QueryHandler<FindCommentQuery, CommentsReadModel | null> {
  constructor(
    private commentsReadRepository: CommentsReadRepository
  ) { }

  async handle(query: FindCommentQuery): Promise<CommentsReadModel | null> {
    return await this.commentsReadRepository.findById(query.commentId);
  }
}
