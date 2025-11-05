import { Post } from "../entity/post.entity";

export interface PostWriteRepository {
  save(post: Post): Promise<void>
  findById(id: string): Promise<Post | null> // Post
  findByUserId(userId: string): Promise<Post[]> // user post
  delete(post: Post): Promise<void>
}
