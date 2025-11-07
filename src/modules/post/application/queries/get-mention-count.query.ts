import { Query } from '../../../../shared/domain/query';

export class GetMentionCountQuery extends Query {
  constructor(
    queryId: string,
    public readonly userId: string,
    public readonly includeRead?: boolean
  ) {
    super(queryId);
  }

  static create(
    userId: string,
    includeRead: boolean = false
  ): GetMentionCountQuery {
    return new GetMentionCountQuery(
      `query_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      userId,
      includeRead
    );
  }
}