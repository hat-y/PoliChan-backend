import { Query } from '../../../../shared/domain/query';

export class GetUserTimelineQuery extends Query {
  constructor(
    queryId: string,
    public readonly userId: string,
    public readonly afterPostId?: string,
    public readonly limit?: number
  ) {
    super(queryId);
  }
}
