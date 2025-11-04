import { Command } from '../../../../shared/domain/command';

export class DeletePostCommand extends Command {
  constructor(
    commandId: string,
    public readonly postId: string
  ) {
    super(commandId);
  }
}