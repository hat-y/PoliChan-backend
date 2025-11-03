import { EventHandler } from '../../../../shared/domain/event-handler';
import { User, UserUpdatedEvent } from '../../domain/entities/user.entity';
import { UserReadRepository } from '../../domain/interfaces/user-read-repository.interface';

export class UserUpdatedEventHandler implements EventHandler<UserUpdatedEvent> {
  constructor(private userRepository: UserReadRepository) {}

  async handle(event: UserUpdatedEvent): Promise<void> {
    const user = User.create(event.userId, event.email, event.name);
    await this.userRepository.save(user);
  }
}
