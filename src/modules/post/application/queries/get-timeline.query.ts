import { Query } from '../../../../shared/domain/query';

export class GetTimelineQuery extends Query {

  constructor(
    queryId: string,
    public readonly afterPostId?: string,
    public readonly limit?: number
  ) {
    super(queryId);
  }
}
