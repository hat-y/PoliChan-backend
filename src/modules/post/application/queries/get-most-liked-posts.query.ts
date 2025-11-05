import { Query } from '../../../../shared/domain/query';

export class GetMostLikedPostsQuery extends Query {

  constructor(
    queryId: string,
    public readonly limit?: number
  ) {
    super(queryId);
  }

}
