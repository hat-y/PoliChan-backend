import { EventHandler } from '../../../../shared/domain/event-handler';
import { User, UserRegisteredEvent } from '../../domain/entities/user.entity';
import { UserReadRepository } from '../../domain/interfaces/user-read-repository.interface';

export class UserRegisteredEventHandler
  implements EventHandler<UserRegisteredEvent>
{
  constructor(private userRepository: UserReadRepository) {}
  async handle(event: UserRegisteredEvent): Promise<void> {
    console.log('UserRegisteredEventHandler received event:', event);
    const user = User.create(
      event.userId,
      event.firstName,
      event.lastName,
      event.userName,
      event.password
    );
    await this.userRepository.save(user);
  }
}
