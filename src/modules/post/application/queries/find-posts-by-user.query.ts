import { Query } from '../../../../shared/domain/query';

export class FindPostsByUserQuery extends Query {
  constructor(
    public readonly queryId: string,
    public readonly userId: string,
    public readonly limit?: number) {
    super(queryId);
  }
}
