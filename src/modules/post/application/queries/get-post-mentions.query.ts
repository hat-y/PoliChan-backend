import { Query } from '../../../../shared/domain/query';

export class GetPostMentionsQuery extends Query {
  constructor(
    queryId: string,
    public readonly postId: string,
    public readonly limit?: number,
    public readonly offset?: number
  ) {
    super(queryId);
  }

  static create(
    postId: string,
    options: {
      limit?: number;
      offset?: number;
    } = {}
  ): GetPostMentionsQuery {
    return new GetPostMentionsQuery(
      `query_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      postId,
      options.limit,
      options.offset
    );
  }
}