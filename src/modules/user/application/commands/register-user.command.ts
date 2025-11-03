import { Command } from '../../../../shared/domain/command';

export class RegisterUserCommand extends Command {
  constructor(
    commandId: string,
    public readonly userId: string,
    public readonly email: string,
    public readonly name: string
  ) {
    super(commandId);
    this.email = email;
    this.name = name;
  }
}
