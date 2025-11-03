import { CommandHandler } from '../../../../shared/domain/command-handler';
import { User, UserRegisterEvent } from '../../domain/entities/user.entity';
import { UserWriteRepository } from '../../domain/interfaces/user-write-repository.inferface';
import { RegisterUserCommand } from '../commands/register-user.command';
import { MessageBus } from '../../../../shared/domain/message-bus';
import { v4 } from 'uuid';

export class RegisterUserCommandHandler
  implements CommandHandler<RegisterUserCommand>
{
  constructor(
    private userRepository: UserWriteRepository,
    private messageBus: MessageBus
  ) {}

  async handler(command: RegisterUserCommand): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(command.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    const newUser = User.create(command.userId, command.email, command.name);
    await this.userRepository.save(newUser);

    // Publish User Registered Event
    const event = new UserRegisterEvent(
      v4(),
      newUser.id,
      newUser.email,
      newUser.name
    );

    this.messageBus.publishEvent(event);
  }
}
