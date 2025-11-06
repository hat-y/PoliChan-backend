import { CommentsWriteRepository } from '../../domain/interfaces/comments-write-repository.interface';
import { Comments } from '../../domain/entity/comments.entity';
import { WriteDatabase } from '../../../../shared/infrastructure/postgres/write-database';
import { CommentPostgresEntity } from '../../../../shared/infrastructure/postgres/entities/comment-postgres.entity';
import { Timestamps } from '../../../../shared/domain/datetime';

export class PostgresCommentsWriteRepository implements CommentsWriteRepository {
  constructor(
    private writeDatabase: WriteDatabase
  ) { }

  async save(comment: Comments): Promise<void> {
    const repo = this.writeDatabase.connection.getRepository(CommentPostgresEntity);

    await repo.upsert({
      id: comment.id,
      postId: comment.postId,
      userId: comment.userId,
      content: comment.content,
      likes: comment.likes,
      createdAt: comment.timestamps.createdAt.toDate(),
      updatedAt: comment.timestamps.updatedAt.toDate(),
      deletedAt: comment.timestamps.deletedAt?.toDate()
    }, {
      conflictPaths: ['id'],
      skipUpdateIfNoValuesChanged: true
    });
  }

  async delete(commentId: string): Promise<void> {
    const repo = this.writeDatabase.connection.getRepository(CommentPostgresEntity);
    await repo.softDelete(commentId);
  }

  async findByIdForValidation(commentId: string): Promise<Comments | null> {
    const repo = this.writeDatabase.connection.getRepository(CommentPostgresEntity);
    const entity = await repo.findOne({
      where: { id: commentId },
      withDeleted: true
    });

    if (!entity || entity.deletedAt) return null;

    return this.mapEntityToDomain(entity);
  }

  async existsById(commentId: string): Promise<boolean> {
    const repo = this.writeDatabase.connection.getRepository(CommentPostgresEntity);
    const count = await repo.count({
      where: { id: commentId },
      withDeleted: true
    });
    return count > 0;
  }

  async findByPostIdForValidation(postId: string): Promise<Comments[]> {
    const repo = this.writeDatabase.connection.getRepository(CommentPostgresEntity);
    const entities = await repo.find({
      where: { postId },
      withDeleted: true
    });

    return entities
      .filter(entity => !entity.deletedAt)
      .map(entity => this.mapEntityToDomain(entity));
  }

  private mapEntityToDomain(entity: CommentPostgresEntity): Comments {
    const timestamps = Timestamps.from(
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt
    );

    return new Comments(
      entity.id,
      entity.postId,
      entity.userId,
      entity.likes,
      entity.content,
      timestamps
    );
  }
}
