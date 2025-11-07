import { PostMentionReadRepository } from '../../domain/interfaces/post-mention-read-repository.interface';
import { PostMentionReadModel, GetUserMentionsQuery, GetPostMentionsQuery } from '../../domain/interfaces/post-mention-read-model.interface';
import { ReadDatabase } from '../../../../shared/infrastructure/mongo/read-database';
import { Timestamps, CreatedAt } from '../../../../shared/domain/datetime';
import { PostMentionMongoEntity } from '../../../../shared/infrastructure/mongo/entities/post-mention-mongo.entity';

export class MongoPostMentionReadRepository implements PostMentionReadRepository {
  constructor(
    private readDatabase: ReadDatabase
  ) {}

  async save(mention: PostMentionReadModel): Promise<void> {
    const repository = this.readDatabase.connection.getMongoRepository(PostMentionMongoEntity);

    await repository.save({
      id: mention.id,
      postId: mention.postId,
      mentionedUserId: mention.mentionedUserId,
      mentionerUserId: mention.mentionerUserId,
      post: mention.post,
      mentionedUser: mention.mentionedUser,
      mentionerUser: mention.mentionerUser,
      isRead: mention.isRead || false,
      engagementStats: mention.engagementStats,
      timestamps: {
        createdAt: mention.timestamps.createdAt.toDate(),
        updatedAt: mention.timestamps.updatedAt.toDate()
      }
    });
  }

  async update(mention: PostMentionReadModel): Promise<void> {
    const repository = this.readDatabase.connection.getMongoRepository(PostMentionMongoEntity);

    await repository.update(
      { id: mention.id },
      {
        post: mention.post,
        mentionedUser: mention.mentionedUser,
        mentionerUser: mention.mentionerUser,
        isRead: mention.isRead,
        engagementStats: mention.engagementStats,
        timestamps: {
          createdAt: mention.timestamps.createdAt.toDate(),
          updatedAt: new Date()
        }
      }
    );
  }

  async getUserMentions(query: GetUserMentionsQuery): Promise<PostMentionReadModel[]> {
    const repository = this.readDatabase.connection.getMongoRepository(PostMentionMongoEntity);

    const mongoQuery: any = {
      mentionedUserId: query.userId
    };

    // Filtros opcionales
    if (!query.includeRead) {
      mongoQuery.isRead = false;
    }

    const entities = await repository.find({
      where: mongoQuery,
      order: { 'timestamps.createdAt': -1 },
      take: query.limit || 20,
      skip: query.offset || 0
    });

    return entities.map(entity => this.mapEntityToReadModel(entity));
  }

  async getPostMentions(query: GetPostMentionsQuery): Promise<PostMentionReadModel[]> {
    const repository = this.readDatabase.connection.getMongoRepository(PostMentionMongoEntity);

    const entities = await repository.find({
      where: { postId: query.postId },
      order: { 'timestamps.createdAt': 1 },
      take: query.limit || 50,
      skip: query.offset || 0
    });

    return entities.map(entity => this.mapEntityToReadModel(entity));
  }

  async countUserMentions(userId: string, includeRead: boolean = false): Promise<number> {
    const repository = this.readDatabase.connection.getMongoRepository(PostMentionMongoEntity);

    const mongoQuery: any = { mentionedUserId: userId };
    if (!includeRead) {
      mongoQuery.isRead = false;
    }

    return await repository.count(mongoQuery);
  }

  async findUnreadCount(userId: string): Promise<number> {
    const repository = this.readDatabase.connection.getMongoRepository(PostMentionMongoEntity);

    return await repository.count({
      mentionedUserId: userId,
      isRead: false
    });
  }

  async markAsRead(mentionId: string, userId: string): Promise<void> {
    const repository = this.readDatabase.connection.getMongoRepository(PostMentionMongoEntity);

    await repository.update(
      {
        id: mentionId,
        mentionedUserId: userId
      },
      {
        isRead: true,
        timestamps: {
          updatedAt: new Date()
        }
      }
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    const repository = this.readDatabase.connection.getMongoRepository(PostMentionMongoEntity);

    await repository.updateMany(
      {
        mentionedUserId: userId,
        isRead: false
      },
      {
        $set: {
          isRead: true,
          'timestamps.updatedAt': new Date()
        }
      }
    );
  }

  async deleteByPostId(postId: string): Promise<void> {
    const repository = this.readDatabase.connection.getMongoRepository(PostMentionMongoEntity);

    await repository.deleteMany({ postId });
  }

  private mapEntityToReadModel(entity: any): PostMentionReadModel {
    const timestamps = new Timestamps(
      CreatedAt.from(entity.timestamps.createdAt),
      CreatedAt.from(entity.timestamps.updatedAt),
      undefined
    );

    return {
      id: entity.id,
      postId: entity.postId,
      mentionedUserId: entity.mentionedUserId,
      mentionerUserId: entity.mentionerUserId,
      post: entity.post,
      mentionedUser: entity.mentionedUser,
      mentionerUser: entity.mentionerUser,
      isRead: entity.isRead,
      engagementStats: entity.engagementStats,
      timestamps
    };
  }
}