import { Command } from '../../../../shared/domain/command';

export class LikePostCommand extends Command {
  constructor(
    commandId: string,
    public readonly postId: string,
    public readonly userId: string
  ) {
    super(commandId);
  }
}