import { Command } from '../../../../shared/domain/command';

export class RegisterUserCommand extends Command {
  constructor(
    commandId: string,
    public readonly userId: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly userName: string,
    public readonly password: string
  ) {
    super(commandId);
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.password = password;
  }
}
