import { EventHandler } from '../../../../shared/domain/event-handler';
import { UserUpdatedEvent } from '../../domain/entities/user.entity';
import { UserReadRepository } from '../../domain/interfaces/user-read-repository.interface';

export class UserUpdatedEventHandler implements EventHandler<UserUpdatedEvent> {
  constructor(private userRepository: UserReadRepository) {}

  async handle(event: UserUpdatedEvent): Promise<void> {
    // Busca el usuario actual en el read model
    const existingUser = await this.userRepository.findById(event.userId);
    if (!existingUser) {
      throw new Error('User not found in read model');
    }

    // Crea el read model actualizado
    const updatedUserReadModel = {
      id: event.userId,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      userName: event.userName,
      password: existingUser.password,
      createdAt: existingUser.createdAt,
      updatedAt: event.occurredAt
    };

    await this.userRepository.save(updatedUserReadModel);
  }
}
