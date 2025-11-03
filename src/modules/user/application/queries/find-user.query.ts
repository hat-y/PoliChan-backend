import { Query } from '../../../../shared/domain/query';

export class FindUserQuery extends Query {
  public readonly userId: string;

  constructor(queryId: string, userId: string) {
    super(queryId);
    this.userId = userId;
  }
}
