import { QueryHandler } from '../../../../shared/domain/query-handler';
import { CommentsReadRepository } from '../../domain/interfaces/comments-read-repository.interface';
import { CountCommentsByPostQuery } from '../queries/count-comments-by-post.query';

export interface CommentCount {
  postId: string;
  totalComments: number;
  activeComments: number;
}

export class CountCommentsByPostQueryHandler implements QueryHandler<CountCommentsByPostQuery, CommentCount> {
  constructor(
    private commentsReadRepository: CommentsReadRepository
  ) { }

  async handle(query: CountCommentsByPostQuery): Promise<CommentCount> {
    const totalComments = await this.commentsReadRepository.countByPostId(query.postId);

    // Por ahora, consideramos todos los comentarios como activos
    // En el futuro podríamos tener una lógica más compleja para comentarios eliminados/borrados
    const activeComments = totalComments;

    return {
      postId: query.postId,
      totalComments,
      activeComments
    };
  }
}