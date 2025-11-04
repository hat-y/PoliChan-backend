import { PostReadModel } from "./post-read-model.interface";

export interface PostReadRepository {
  findById(id: string): Promise<PostReadModel | null>
  findByUserId(userId: string): Promise<PostReadModel[]>
  findAll(limit?: number, offset?: number): Promise<PostReadModel[]>
  findWithLikesCount(postId: string): Promise<PostReadModel | null>;
  findTimeline(afterPostId?: string, limit?: number): Promise<PostReadModel[]>
  findUserTimeline(userId: string, afterPostId?: string, limit?: number): Promise<PostReadModel[]>
}
