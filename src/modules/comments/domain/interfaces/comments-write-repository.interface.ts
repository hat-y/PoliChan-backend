import { Comments } from '../entity/comments.entity';

export interface CommentsWriteRepository {
  save(comment: Comments): Promise<void>;
  delete(commentId: string): Promise<void>;
  findByIdForValidation(commentId: string): Promise<Comments | null>;
  existsById(commentId: string): Promise<boolean>;
  findByPostIdForValidation(postId: string): Promise<Comments[]>;
}
