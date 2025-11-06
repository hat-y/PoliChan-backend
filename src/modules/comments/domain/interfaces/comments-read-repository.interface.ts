import { CommentsReadModel } from "./comments-read-model.interface";

export interface CommentsReadRepository {
  save(comment: CommentsReadModel): Promise<void>;
  update(comment: CommentsReadModel): Promise<void>;
  findById(id: string): Promise<CommentsReadModel | null>;
  findByPostId(postId: string): Promise<CommentsReadModel[]>;
  findByUserId(userId: string): Promise<CommentsReadModel[]>;
  delete(id: string): Promise<void>;
  findWithUserByPostId(postId: string): Promise<CommentsReadModel[]>;
  countByPostId(postId: string): Promise<number>;
}
