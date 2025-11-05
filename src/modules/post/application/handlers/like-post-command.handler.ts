import { CommandHandler } from '../../../../shared/domain/command-handler';
import { Post, LikeCreatedEvent } from '../../domain/entity/post.entity';
import { PostWriteRepository } from '../../domain/interfaces/post-write-repository.interface';
import { LikePostCommand } from '../commands/like-post.command';
import { MessageBus } from '../../../../shared/domain/message-bus';
import { v4 } from 'uuid';

export class LikePostCommandHandler implements CommandHandler<LikePostCommand> {
  constructor(
    private postRepository: PostWriteRepository,
    private messageBus: MessageBus
  ) {}

  async handle(command: LikePostCommand): Promise<void> {
    const post = await this.postRepository.findById(command.postId);

    if (!post) {
      throw new Error(`Post with id ${command.postId} not found`);
    }

    const likedPost = post.like(command.userId);

    await this.postRepository.save(likedPost);

    const event = new LikeCreatedEvent(v4(), likedPost.id, command.userId);

    this.messageBus.publishEventAsync(event);
  }
}
