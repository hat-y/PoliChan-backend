import { Query } from '../../../../shared/domain/query';

// Query to Get All Users
export class GetAllUsersQuery extends Query {
  constructor(queryId: string) {
    super(queryId);
  }
}
