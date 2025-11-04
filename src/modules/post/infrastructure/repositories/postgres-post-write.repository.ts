import { WriteDatabase } from '../../../../shared/infrastructure/postgres/write-database';
import { Post } from '../../domain/entity/post.entity';
import { PostWriteRepository } from '../../domain/interfaces/post-write-repository.interface';
import { PostPostgresEntity } from '../../../../shared/infrastructure/postgres/entities/post-postgres.entity';
import { Timestamps } from '../../../../shared/domain/datetime';

export class PostgresPostWriteRepository implements PostWriteRepository {
  constructor(private writeDataBase: WriteDatabase) {}

  async save(post: Post): Promise<void> {
    const repo =
      this.writeDataBase.connection.getRepository(PostPostgresEntity);
    const entity = repo.create({
      id: post.id,
      userId: post.userId,
      content: post.content,
      likesCount: post.likesCount,
      createdAt: post.timestamps.createdAt.toDate(),
      updatedAt: post.timestamps.updatedAt.toDate(),
      deletedAt: post.timestamps.deletedAt?.toDate()
    });
    await repo.save(entity);
  }

  async findById(id: string): Promise<Post | null> {
    const repo =
      this.writeDataBase.connection.getRepository(PostPostgresEntity);
    const entity = await repo.findOneBy({ id });

    if (!entity) return null;

    const timestamps = Timestamps.from(
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt
    );

    return new Post(
      entity.id,
      entity.userId,
      entity.content,
      entity.likesCount,
      timestamps
    );
  }

  async findByUserId(userId: string): Promise<Post[]> {
    const repo =
      this.writeDataBase.connection.getRepository(PostPostgresEntity);
    const entities = await repo.findBy({ userId });

    return entities.map(entity => {
      const timestamps = Timestamps.from(
        entity.createdAt,
        entity.updatedAt,
        entity.deletedAt
      );

      return new Post(
        entity.id,
        entity.userId,
        entity.content,
        entity.likesCount,
        timestamps
      );
    });
  }

  async delete(post: Post): Promise<void> {
    const repo =
      this.writeDataBase.connection.getRepository(PostPostgresEntity);
    await repo.update(post.id, {
      deletedAt: post.timestamps.deletedAt?.toDate(),
      updatedAt: post.timestamps.updatedAt.toDate()
    });
  }
}