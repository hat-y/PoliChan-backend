import { EventHandler } from '../../../../shared/domain/event-handler';
import { UserRegisteredEvent } from '../../domain/entities/user.entity';
import { UserReadRepository } from '../../domain/interfaces/user-read-repository.interface';
import { UserEventBroadcaster } from '../broadcasting/interface/user-event-broadcaster.interface';

export class UserRegisteredEventHandler
  implements EventHandler<UserRegisteredEvent>
{
  constructor(
    private userRepository: UserReadRepository,
    private broadcaster: UserEventBroadcaster
  ) {}

  async handle(event: UserRegisteredEvent): Promise<void> {
    console.log('UserRegisteredEventHandler received event:', event);

    const userReadModel = {
      id: event.userId,
      firstName: event.firstName,
      lastName: event.lastName,
      userName: event.userName,
      password: event.password,
      createdAt: event.occurredAt,
      updatedAt: event.occurredAt
    };

    await this.userRepository.save(userReadModel);

    this.broadcaster.broadcastUserRegistered(event);
  }
}
