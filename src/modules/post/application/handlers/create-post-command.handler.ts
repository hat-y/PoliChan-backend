// External modules 
import { v4 } from 'uuid';

// Internal modules
import { CommandHandler } from '../../../../shared/domain/command-handler';
import { Post, PostCreatedEvent } from '../../domain/entity/post.entity';
import { PostWriteRepository } from '../../domain/interfaces/post-write-repository.interface';
import { CreatePostCommand } from '../commands/create-post.command';
import { MessageBus } from '../../../../shared/domain/message-bus';

export class CreatePostCommandHandler implements CommandHandler<CreatePostCommand> {

  constructor(
    private postRepository: PostWriteRepository,
    private messageBus: MessageBus
  ) { }

  async handle(command: CreatePostCommand): Promise<void> {
    const postId = v4();

    const newPost = Post.create(
      postId,
      command.userId,
      command.fullName,
      command.username,
      command.content
    );

    await this.postRepository.save(newPost);

    const event = new PostCreatedEvent(
      v4(),
      newPost.id,
      newPost.userId,
      newPost.content,
      newPost.likesCount
    );

    this.messageBus.publishEventAsync(event);
  }
}
