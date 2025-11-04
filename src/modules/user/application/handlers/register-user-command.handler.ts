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

  async handle(command: RegisterUserCommand): Promise<void> {
    const existingUser = await this.userRepository.findByUserName(
      command.userName
    );
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    const newUser = User.create(
      command.userId,
      command.firstName,
      command.lastName,
      command.userName,
      command.password
    );
    await this.userRepository.save(newUser);

    // Publish User Registered Event
    const event = new UserRegisterEvent(
      v4(),
      newUser.id,
      newUser.firstName,
      newUser.lastName,
      newUser.userName,
      newUser.password
    );

    this.messageBus.publishEventAsync(event);
  }
}
