import { Query } from '../../../../shared/domain/query';
import { GetUserMentionsQuery as GetUserMentionsQueryInterface } from '../../domain/interfaces/post-mention-read-model.interface';

export class GetUserMentionsQuery extends Query {
  constructor(
    queryId: string,
    public readonly userId: string,
    public readonly limit?: number,
    public readonly offset?: number,
    public readonly includeRead?: boolean,
    public readonly fromDate?: Date,
    public readonly toDate?: Date
  ) {
    super(queryId);
  }

  static create(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      includeRead?: boolean;
      fromDate?: Date;
      toDate?: Date;
    } = {}
  ): GetUserMentionsQuery {
    return new GetUserMentionsQuery(
      `query_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      userId,
      options.limit,
      options.offset,
      options.includeRead,
      options.fromDate,
      options.toDate
    );
  }
}