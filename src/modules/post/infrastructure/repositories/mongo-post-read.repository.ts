import { PostMongoEntity } from "../../../../shared/infrastructure/mongo/entities/post-mongo.entity";
import { ReadDatabase } from "../../../../shared/infrastructure/mongo/read-database";
import { PostReadModel } from "../../domain/interfaces/post-read-model.interface";
import { PostReadRepository } from "../../domain/interfaces/post-read-repository.interface";
import { Timestamps, CreatedAt, UpdatedAt, DeletedAt } from "../../../../shared/domain/datetime";

export class MongoPostReadRepository implements PostReadRepository {
  constructor(
    private readDataBase: ReadDatabase
  ) { }

  async findById(id: string): Promise<PostReadModel | null> {
    const postRepo = this.readDataBase.connection.getMongoRepository(PostMongoEntity);
    const post = await postRepo.findOne({ where: { id } });

    if (!post) {
      return null;
    }

    return this.mapToReadModel(post);
  }

  async findByUserId(userId: string): Promise<PostReadModel[]> {
    const postRepo = this.readDataBase.connection.getMongoRepository(PostMongoEntity);
    const posts = await postRepo.find({
      where: { userId },
      order: { createdAt: -1 }
    });

    return posts.map(post => this.mapToReadModel(post));
  }

  async findAll(limit: number = 50, offset: number = 0): Promise<PostReadModel[]> {
    const postRepo = this.readDataBase.connection.getMongoRepository(PostMongoEntity);
    const posts = await postRepo.find({
      where: { deletedAt: null },
      order: { createdAt: -1 },
      take: limit,
      skip: offset
    });

    return posts.map(post => this.mapToReadModel(post));
  }

  async findTimeline(afterPostId?: string, limit: number = 50): Promise<PostReadModel[]> {
    const postRepo = this.readDataBase.connection.getMongoRepository(PostMongoEntity);

    let query = postRepo.createQueryBuilder('post')
      .where('post.deletedAt IS NULL')
      .orderBy('post.createdAt', 'DESC')
      .take(limit);

    if (afterPostId) {
      const afterPost = await this.findById(afterPostId);
      if (afterPost) {
        query = query.andWhere('post.createdAt < :createdAt', {
          createdAt: afterPost.timestamps.createdAt
        });
      }
    }

    const posts = await query.getMany();
    return posts.map(post => this.mapToReadModel(post));
  }

  async findUserTimeline(
    userId: string, afterPostId?: string, limit: number = 50
  ): Promise<PostReadModel[]> {

    const postRepo = this.readDataBase.connection.getMongoRepository(PostMongoEntity);

    let query = postRepo.createQueryBuilder('post')
      .where('post.userId = :userId', { userId })
      .andWhere('post.deletedAt IS NULL')
      .orderBy('post.createdAt', 'DESC')
      .take(limit);

    if (afterPostId) {
      const afterPost = await this.findById(afterPostId);
      if (afterPost) {
        query = query.andWhere('post.createdAt < :createdAt', {
          createdAt: afterPost.timestamps.createdAt
        });
      }
    }

    const posts = await query.getMany();
    return posts.map(post => this.mapToReadModel(post));
  }

  async findWithLikesCount(postId: string): Promise<PostReadModel | null> {
    const postRepo = this.readDataBase.connection.getMongoRepository(PostMongoEntity);
    const post = await postRepo.findOne({ where: { id: postId } });

    if (!post) {
      return null;
    }

    return this.mapToReadModel(post);
  }

  async findByMinLikes(minLikes: number, limit: number = 50): Promise<PostReadModel[]> {
    const postRepo = this.readDataBase.connection.getMongoRepository(PostMongoEntity);
    const posts = await postRepo.find({
      where: {
        likesCount: { $gte: minLikes },
        deletedAt: null
      },
      order: { likesCount: -1, createdAt: -1 },
      take: limit
    });

    return posts.map(post => this.mapToReadModel(post));
  }

  async findByLikesRange(
    minLikes: number, maxLikes: number, limit: number = 50
  ): Promise<PostReadModel[]> {

    const postRepo = this.readDataBase.connection.getMongoRepository(PostMongoEntity);
    const posts = await postRepo.find({
      where: {
        likesCount: { $gte: minLikes, $lte: maxLikes },
        deletedAt: null
      },
      order: { likesCount: -1, createdAt: -1 },
      take: limit
    });

    return posts.map(post => this.mapToReadModel(post));
  }

  async findMostLiked(limit: number = 20): Promise<PostReadModel[]> {
    const postRepo = this.readDataBase.connection.getMongoRepository(PostMongoEntity);
    const posts = await postRepo.find({
      where: { deletedAt: null },
      order: { likesCount: -1, createdAt: -1 },
      take: limit
    });

    return posts.map(post => this.mapToReadModel(post));
  }

  
  private mapToReadModel(entity: PostMongoEntity): PostReadModel {
    return {
      id: entity.id,
      userId: entity.userId,
      content: entity.content,
      likesCount: entity.likesCount,
      timestamps: new Timestamps(
        CreatedAt.from(entity.createdAt),
        UpdatedAt.from(entity.updatedAt),
        entity.deletedAt ? DeletedAt.from(entity.deletedAt) : undefined
      )
    };
  }
}
