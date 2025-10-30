import { User } from '../../domain/user.entity';
import { UserRepository } from '../../domain/user.repository';

export interface CreateUserRequest {
  email: string;
  name: string;
}

export class CreateUserCommand {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(request: CreateUserRequest): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const id = this.generateId();
    const user = User.create(id, request.email, request.name);

    await this.userRepository.save(user);
    return user;
  }

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }
}