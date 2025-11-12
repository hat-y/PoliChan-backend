import { QueryHandler } from '../../../../shared/domain/query-handler';
import { UserReadModel } from '../../domain/interfaces/user-read-model.interface';

import { UserReadRepository } from '../../domain/interfaces/user-read-repository.interface';
import { LoginUserQuery } from '../queries/login-user.query';

export class LoginUserQueryHandler
  implements QueryHandler<LoginUserQuery, UserReadModel | null>
{
  constructor(private userReadRepository: UserReadRepository) {}

  async handle(query: LoginUserQuery): Promise<any> {
    const user = await this.userReadRepository.finByUserName(query.userName);
    if (!user || user.password !== query.password) {
      return null;
    }
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
    };
  }
}
