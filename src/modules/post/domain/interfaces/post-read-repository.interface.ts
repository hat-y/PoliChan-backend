import { PostReadModel } from "./post-read-model.interface";

export interface PostReadRepository {
  findById(id: string): Promise<PostReadModel | null>
  findByUserId(userId: string): Promise<PostReadModel[]>
  findAll(limit?: number, offset?: number): Promise<PostReadModel[]>

  // Find for Timeline
  findTimeline(afterPostId?: string, limit?: number): Promise<PostReadModel[]>
  findUserTimeline(userId: string, afterPostId?: string, limit?: number): Promise<PostReadModel[]>

  // Find for likes
  findByLikesRange(minLikes: number, maxLikes: number, limit?: number): Promise<PostReadModel[]>
  findMostLiked(limit?: number): Promise<PostReadModel[]>
}
