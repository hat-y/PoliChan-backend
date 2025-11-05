import { CommandHandler } from '../../../../shared/domain/command-handler';
import { Post, LikeRemovedEvent } from '../../domain/entity/post.entity';
import { PostWriteRepository } from '../../domain/interfaces/post-write-repository.interface';
import { UnlikePostCommand } from '../commands/unlike-post.command';
import { MessageBus } from '../../../../shared/domain/message-bus';
import { v4 } from 'uuid';

export class UnlikePostCommandHandler
  implements CommandHandler<UnlikePostCommand>
{
  constructor(
    private postRepository: PostWriteRepository,
    private messageBus: MessageBus
  ) {}

  async handle(command: UnlikePostCommand): Promise<void> {
    const post = await this.postRepository.findById(command.postId);

    if (!post) {
      throw new Error(`Post with id ${command.postId} not found`);
    }

    const unlikedPost = post.unlike(command.userId);

    await this.postRepository.save(unlikedPost);

    const event = new LikeRemovedEvent(v4(), unlikedPost.id, command.userId);

    this.messageBus.publishEventAsync(event);
  }
}
