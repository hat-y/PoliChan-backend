import { PostReadModel } from "../../../post/domain/interfaces/post-read-model.interface";
import { CommentsReadModel } from "./comments-read-model.interface";

export interface CommentsReadRepository {
  save(comments: CommentsReadModel): Promise<PostReadModel>
}
