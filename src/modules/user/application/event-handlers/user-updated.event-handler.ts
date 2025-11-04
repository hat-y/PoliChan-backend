import { EventHandler } from '../../../../shared/domain/event-handler';
import { User, UserUpdatedEvent } from '../../domain/entities/user.entity';
import { UserReadRepository } from '../../domain/interfaces/user-read-repository.interface';

export class UserUpdatedEventHandler implements EventHandler<UserUpdatedEvent> {
  constructor(private userRepository: UserReadRepository) {}

  async handle(event: UserUpdatedEvent): Promise<void> {
    // Busca el usuario actual en el read model
    const existingUser = await this.userRepository.findById(event.userId);
    if (!existingUser) {
      throw new Error('User not found in read model');
    }

    // Usa los datos existentes para los campos que faltan
    const user = User.create(
      event.userId,
      existingUser.firstName,
      existingUser.lastName,
      event.userName,
      existingUser.password
    );
    await this.userRepository.save(user);
  }
}
