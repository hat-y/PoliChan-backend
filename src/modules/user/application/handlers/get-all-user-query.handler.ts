import { QueryHandler } from '../../../../shared/domain/query-handler';
import { UserReadModel } from '../../domain/interfaces/user-read-model.interface';
import { UserReadRepository } from '../../domain/interfaces/user-read-repository.interface';
import { GetAllUsersQuery } from '../queries/get-all-users.query';

export class GetAllUsersQueryHandler
  implements QueryHandler<GetAllUsersQuery, UserReadModel[]>
{
  constructor(private userRepository: UserReadRepository) {}

  async handler(query: GetAllUsersQuery): Promise<UserReadModel[]> {
    return await this.userRepository.findAll();
  }
}
