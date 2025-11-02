import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/interfaces/user-repository.interface';

export class GetAllUsersQuery {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
