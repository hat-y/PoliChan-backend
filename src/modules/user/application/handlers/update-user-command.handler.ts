import { v4 } from 'uuid';
import { CommandHandler } from '../../../../shared/domain/command-handler';
import { MessageBus } from '../../../../shared/domain/message-bus';
import { UserUpdatedEvent } from '../../domain/entities/user.entity';
import { UserWriteRepository } from '../../domain/interfaces/user-write-repository.inferface';
import { UpdateUserCommand } from '../commands/update-user.command';

export class UpdatedUserCommandHandler
  implements CommandHandler<UpdateUserCommand>
{
  constructor(
    private userRepository: UserWriteRepository,
    private messageBus: MessageBus
  ) {}

  async handler(command: UpdateUserCommand): Promise<void> {
    const foundUser = await this.userRepository.findById(command.userId);
    if (!foundUser) {
      throw new Error('User not found');
    }

    const updatedUser = foundUser.updateName(command.name);
    await this.userRepository.save(updatedUser);

    const event = new UserUpdatedEvent(
      v4(),
      updatedUser.id,
      updatedUser.email,
      updatedUser.name
    );

    this.messageBus.publishEvent(event);
  }
}
