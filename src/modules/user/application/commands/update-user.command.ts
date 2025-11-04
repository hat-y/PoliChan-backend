import { Command } from '../../../../shared/domain/command';

export class UpdateUserCommand extends Command {
  constructor(
    commandId: string,
    public readonly userId: string,
    public readonly userName: string
  ) {
    super(commandId);
  }
}
