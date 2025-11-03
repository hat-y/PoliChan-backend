import { EventHandler } from '../../../../shared/domain/event-handler';
import { User, UserRegisterEvent } from '../../domain/entities/user.entity';
import { UserReadRepository } from '../../domain/interfaces/user-read-repository.interface';

export class UserRegisteredEventHandler
  implements EventHandler<UserRegisterEvent>
{
  constructor(private userRepository: UserReadRepository) {}
  async handle(event: UserRegisterEvent): Promise<void> {
    const user = User.create(event.userId, event.email, event.name);
    await this.userRepository.save(user);
  }
}
