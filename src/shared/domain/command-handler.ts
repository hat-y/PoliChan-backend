import { Command } from './command';

export interface CommandHandler<TCommand extends Command> {
  handler(command: TCommand): Promise<void>;
}
