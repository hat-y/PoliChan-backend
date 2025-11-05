import { Command } from '../../../../shared/domain/command';

export class CreatePostCommand extends Command {
  constructor(
    commandId: string,
    public readonly userId: string,
    public readonly content: string
  ) {
    super(commandId);
  }
}
