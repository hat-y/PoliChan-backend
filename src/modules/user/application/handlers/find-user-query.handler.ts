import { QueryHandler } from '../../../../shared/domain/query-handler';
import { UserReadModel } from '../../domain/interfaces/user-read-model.interface';
import { UserReadRepository } from '../../domain/interfaces/user-read-repository.interface';
import { FindUserQuery } from '../queries/find-user.query';

export class FindUserQueryHandler
  implements QueryHandler<FindUserQuery, UserReadModel>
{
  constructor(private userRepository: UserReadRepository) {}

  async handle(query: FindUserQuery): Promise<UserReadModel> {
    const foundUser = await this.userRepository.findById(query.userId);
    if (!foundUser) {
      throw new Error(`User with ID ${query.userId} not found`);
    }
    return foundUser;
  }
}
