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
      likes: comment.likes,
      likesCount: comment.likesCount,
      user: comment.user,
      timestamps: {
        createdAt: comment.timestamps.createdAt.toDate(),
        updatedAt: comment.timestamps.updatedAt.toDate(),
        deletedAt: comment.timestamps.deletedAt?.toDate()
      }
    });
  }

  async update(comment: CommentsReadModel): Promise<void> {
    const repository = this.readDatabase.connection.getRepository('CommentMongoEntity');

    console.log('MongoCommentsReadRepository.update called with:', {
      id: comment.id,
      likes: comment.likes,
      likesCount: comment.likesCount,
      likesLength: comment.likes?.length
    });

    // Usar el método nativo de MongoDB a través del manager
    const result = await this.readDatabase.connection
      .getMongoRepository('CommentMongoEntity')
      .updateOne(
        { _id: comment.id },
        {
          $set: {
            content: comment.content,
            likes: comment.likes,
            likesCount: comment.likesCount,
            user: comment.user,
            'timestamps.updatedAt': comment.timestamps.updatedAt.toDate()
          }
        }
      );

    console.log('MongoDB update result:', result);
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

    console.log('MongoCommentsReadRepository.findById - Raw entity from MongoDB:', {
      id: entity._id,
      likes: entity.likes,
      likesCount: entity.likesCount,
      likesType: typeof entity.likesCount,
      likesLength: entity.likes?.length
    });

    const result = this.mapEntityToReadModel(entity);

    console.log('MongoCommentsReadRepository.findById - Mapped result:', {
      id: result.id,
      likes: result.likes,
      likesCount: result.likesCount,
      likesLength: result.likes?.length
    });

    return result;
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

    console.log('MongoCommentsReadRepository.findByPostId - Raw entities from MongoDB:',
      entities.map(e => ({
        id: e._id,
        likes: e.likes,
        likesCount: e.likesCount,
        likesType: typeof e.likesCount,
        likesLength: e.likes?.length
      }))
    );

    const result = entities.map(entity => this.mapEntityToReadModel(entity));

    console.log('MongoCommentsReadRepository.findByPostId - Mapped results:',
      result.map(r => ({
        id: r.id,
        likes: r.likes,
        likesCount: r.likesCount,
        likesLength: r.likes?.length
      }))
    );

    return result;
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

    console.log('MongoCommentsReadRepository.findWithUserByPostId - Raw entities from MongoDB:',
      entities.map(e => ({
        id: e._id,
        likes: e.likes,
        likesCount: e.likesCount,
        likesType: typeof e.likesCount,
        likesLength: e.likes?.length
      }))
    );

    const result = entities.map(entity => this.mapEntityToReadModel(entity));

    console.log('MongoCommentsReadRepository.findWithUserByPostId - Mapped results:',
      result.map(r => ({
        id: r.id,
        likes: r.likes,
        likesCount: r.likesCount,
        likesLength: r.likes?.length
      }))
    );

    return result;
  }

  async countByPostId(postId: string): Promise<number> {
    const repository = this.readDatabase.connection.getRepository('CommentMongoEntity');
    console.log(`Counting comments for postId: ${postId}`);

    const count = await repository.count({
      where: {
        postId: postId,
        'timestamps.deletedAt': null
      }
    });

    console.log(`Found ${count} comments for postId: ${postId}`);
    return count;
  }

  private mapEntityToReadModel(entity: any): CommentsReadModel {
    const timestamps = new Timestamps(
      CreatedAt.from(entity.timestamps.createdAt),
      UpdatedAt.from(entity.timestamps.updatedAt),
      entity.timestamps.deletedAt ? CreatedAt.from(entity.timestamps.deletedAt) : undefined
    );

    const likes = entity.likes || [];
    const likesCount = likes.length; // Calculate dynamically from the array

    return {
      id: entity._id,
      postId: entity.postId,
      userId: entity.userId,
      content: entity.content,
      likes: likes,
      likesCount: likesCount,
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
