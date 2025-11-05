import { Timestamps } from "../../../../shared/domain/datetime";

export class Comments {
  constructor(
    public readonly id: string,
    public readonly postId: string,
    public readonly userId: string,
    public readonly likesCount: number,
    public readonly content: string,
    public readonly timestamps: Timestamps
  ) { }

  public static create(
    id: string,
    postId: string,
    userId: string,
    content: string
  ): Comments {
    return new Comments(id, postId, userId, 0, content, Timestamps.create())
  }

  public updatePost(newContent: string): Comments {
    return new Comments(this.id, this.postId, this.userId, this.likesCount, newContent, this.timestamps.update())
  }

  public delete(): Comments {
    return new Comments(
      this.id,
      this.userId,
      this.postId,
      this.likesCount,
      this.content,
      this.timestamps.delete()
    )
  }

  public like(): Comments {
    const likedPost = new Comments(
      this.id,
      this.postId,
      this.userId,
      this.likesCount + 1,
      this.content,
      this.timestamps.update()
    );
    return likedPost;
  }

  public unlike(): Comments {
    return new Comments(
      this.id,
      this.postId,
      this.userId,
      Math.max(0, this.likesCount - 1),
      this.content,
      this.timestamps.update()
    );
  }

  // serialize
  public toJSON(): { id: string; postId: string; userId: string; content: string; likesCount: number; timestamps: Timestamps; } {
    return {
      id: this.id,
      postId: this.postId,
      userId: this.userId,
      content: this.content,
      likesCount: this.likesCount,
      timestamps: this.timestamps
    };
  }
}
