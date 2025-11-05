import { CommandHandler } from "../../../../shared/domain/command-handler";
import { PostDeletedEvent } from "../../domain/entity/post.entity";
import { PostWriteRepository } from "../../domain/interfaces/post-write-repository.interface";
import { DeletePostCommand } from "../commands/delete-post.command";
import { MessageBus } from "../../../../shared/domain/message-bus";
import { v4 } from "uuid";

export class DeletePostCommandHandler implements CommandHandler<DeletePostCommand> {
  constructor(
    private postRepository: PostWriteRepository,
    private messageBus: MessageBus
  ) { }

  async handle(command: DeletePostCommand): Promise<void> {
    console.log("Handling DeletePostCommand:", command);

    const existingPost = await this.postRepository.findById(command.postId);

    if (!existingPost) {
      throw new Error(`Post with id ${command.postId} not found`);
    }

    if (existingPost.timestamps.isDeleted()) {
      throw new Error(`Post with id ${command.postId} is already deleted`);
    }

    const deletedPost = existingPost.delete();

    await this.postRepository.save(deletedPost);

    const event = new PostDeletedEvent(v4(), deletedPost.id);

    this.messageBus.publishEventAsync(event);
  }
}
