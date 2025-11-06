import { Command } from '../../../../shared/domain/command';

export class CreateCommentCommand extends Command {
  constructor(
    commandId: string,
    public readonly postId: string,
    public readonly userId: string,
    public readonly content: string
  ) {
    super(commandId);
  }
}