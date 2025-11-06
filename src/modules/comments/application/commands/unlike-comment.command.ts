import { Command } from '../../../../shared/domain/command';

export class UnlikeCommentCommand extends Command {
  constructor(
    commandId: string,
    public readonly commentId: string,
    public readonly userId: string
  ) {
    super(commandId);
  }
}