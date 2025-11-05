import { Query } from '../../../../shared/domain/query';

export class FindPostsByLikesRangeQuery extends Query {
  constructor(
    queryId: string,
    public readonly minLikes: number,
    public readonly maxLikes: number,
    public readonly limit?: number
  ) {
    super(queryId);
  }
}
