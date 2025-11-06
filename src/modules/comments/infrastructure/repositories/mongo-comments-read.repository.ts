import { CommentsReadRepository } from '../../domain/interfaces/comments-read-repository.interface';
import { CommentsReadModel } from '../../domain/interfaces/comments-read-model.interface';
import { ReadDatabase } from '../../../../shared/infrastructure/mongo/read-database';
import { Timestamps, CreatedAt, UpdatedAt } from '../../../../shared/domain/datetime';

export class MongoCommentsReadRepository implements CommentsReadRepository {
  constructor(
    private readDatabase: ReadDatabase
  ) { }

  async save(comment: CommentsReadModel): Promise<void> {
    const repository = this.readDatabase.connection.getRepository('CommentMongoEntity');

    await repository.save({
      _id: comment.id,
      postId: comment.postId,
      userId: comment.userId,
      content: comment.content,
      likesCount: comment.likesCount,
      user: comment.user,
      timestamps: {
        createdAt: comment.timestamps.createdAt.toDate(),
        updatedAt: comment.timestamps.updatedAt.toDate(),
        deletedAt: comment.timestamps.deletedAt?.toDate()
      }
    });
  }

  async findById(id: string): Promise<CommentsReadModel | null> {
    const repository = this.readDatabase.connection.getRepository('CommentMongoEntity');
    const entity = await repository.findOne({
      where: {
        _id: id,
        'timestamps.deletedAt': null
      }
    });

    if (!entity) return null;

    return this.mapEntityToReadModel(entity);
  }

  async findByPostId(postId: string): Promise<CommentsReadModel[]> {
    const repository = this.readDatabase.connection.getRepository('CommentMongoEntity');
    const entities = await repository.find({
      where: {
        postId: postId,
        'timestamps.deletedAt': null
      },
      order: { 'timestamps.createdAt': 'ASC' }
    });

    return entities.map(entity => this.mapEntityToReadModel(entity));
  }

  async findByUserId(userId: string): Promise<CommentsReadModel[]> {
    const repository = this.readDatabase.connection.getRepository('CommentMongoEntity');
    const entities = await repository.find({
      where: {
        userId: userId,
        'timestamps.deletedAt': null
      },
      order: { 'timestamps.createdAt': 'DESC' }
    });

    return entities.map(entity => this.mapEntityToReadModel(entity));
  }

  async delete(id: string): Promise<void> {
    const repository = this.readDatabase.connection.getRepository('CommentMongoEntity');
    await repository.update(
      { _id: id },
      {
        $set: {
          'timestamps.deletedAt': new Date(),
          'timestamps.updatedAt': new Date()
        }
      }
    );
  }

  async findWithUserByPostId(postId: string): Promise<CommentsReadModel[]> {
    const repository = this.readDatabase.connection.getRepository('CommentMongoEntity');
    const entities = await repository.find({
      where: {
        postId: postId,
        'timestamps.deletedAt': null
      },
      order: { 'timestamps.createdAt': 'ASC' }
    });

    return entities.map(entity => this.mapEntityToReadModel(entity));
  }

  async countByPostId(postId: string): Promise<number> {
    const repository = this.readDatabase.connection.getRepository('CommentMongoEntity');
    return await repository.count({
      where: {
        postId: postId,
        'timestamps.deletedAt': null
      }
    });
  }

  private mapEntityToReadModel(entity: any): CommentsReadModel {
    const timestamps = new Timestamps(
      CreatedAt.from(entity.timestamps.createdAt),
      UpdatedAt.from(entity.timestamps.updatedAt),
      entity.timestamps.deletedAt ? CreatedAt.from(entity.timestamps.deletedAt) : undefined
    );

    return {
      id: entity._id,
      postId: entity.postId,
      userId: entity.userId,
      content: entity.content,
      likesCount: entity.likesCount || 0,
      timestamps,
      user: entity.user ? {
        id: entity.user.id,
        firstName: entity.user.firstName,
        lastName: entity.user.lastName,
        username: entity.user.username
      } : undefined
    };
  }
}
