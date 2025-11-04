import { Query } from '../../../../shared/domain/query';

export class LoginUserQuery extends Query {
  public readonly userName: string;
  public readonly password: string;

  constructor(
    queryId: string,

    userName: string,
    password: string
  ) {
    super(queryId);

    this.userName = userName;
    this.password = password;
  }
}
