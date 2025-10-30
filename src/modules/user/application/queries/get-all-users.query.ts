import { User } from '../../domain/user.entity';
import { UserRepository } from '../../domain/user.repository';

export class GetAllUsersQuery {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}