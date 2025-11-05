import { Query } from '../../../../shared/domain/query';

export class FindPostQuery extends Query {
  constructor(
    public readonly queryId: string,
    public readonly postId: string
  ) {
    super(queryId);
  }
}
