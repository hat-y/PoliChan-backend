import { PostMentionWriteRepository } from '../../domain/interfaces/post-mention-write-repository.interface';
import { PostMention } from '../../domain/entity/post-mention.entity';
import { WriteDatabase } from '../../../../shared/infrastructure/postgres/write-database';
import { PostMentionPostgresEntity } from '../../../../shared/infrastructure/postgres/entities/post-mention-postgres.entity';
import { Timestamps } from '../../../../shared/domain/datetime';

export class PostgresPostMentionWriteRepository implements PostMentionWriteRepository {
  constructor(
    private writeDatabase: WriteDatabase
  ) { }

  async save(mention: PostMention): Promise<void> {
    const repo = this.writeDatabase.connection.getRepository(PostMentionPostgresEntity);

    await repo.save({
      id: mention.id,
      postId: mention.postId,
      mentionedUserId: mention.mentionedUserId,
      mentionerUserId: mention.mentionerUserId,
      createdAt: mention.timestamps.createdAt.toDate(),
      updatedAt: mention.timestamps.updatedAt.toDate()
    });
  }

  async saveMany(mentions: PostMention[]): Promise<void> {
    if (mentions.length === 0) return;

    const repo = this.writeDatabase.connection.getRepository(PostMentionPostgresEntity);

    // Usar upsert para evitar duplicados en caso de retry
    await repo.upsert(
      mentions.map(mention => ({
        id: mention.id,
        postId: mention.postId,
        mentionedUserId: mention.mentionedUserId,
        mentionerUserId: mention.mentionerUserId,
        createdAt: mention.timestamps.createdAt.toDate(),
        updatedAt: mention.timestamps.updatedAt.toDate()
      })),
      {
        conflictPaths: ['postId', 'mentionedUserId'],
        skipUpdateIfNoValuesChanged: true
      }
    );
  }

  async findByPostId(postId: string): Promise<PostMention[]> {
    const repo = this.writeDatabase.connection.getRepository(PostMentionPostgresEntity);

    const entities = await repo.find({
      where: { postId },
      order: { createdAt: 'ASC' } // Menciones en orden de aparición
    });

    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async findByMentionedUserId(
    mentionedUserId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<PostMention[]> {
    const repo = this.writeDatabase.connection.getRepository(PostMentionPostgresEntity);

    const entities = await repo.find({
      where: { mentionedUserId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset
    });

    return entities.map(entity => this.mapEntityToDomain(entity));
  }

  async exists(postId: string, mentionedUserId: string): Promise<boolean> {
    const repo = this.writeDatabase.connection.getRepository(PostMentionPostgresEntity);

    const count = await repo.count({
      where: { postId, mentionedUserId }
    });

    return count > 0;
  }

  async countMentionsOfUser(mentionedUserId: string): Promise<number> {
    const repo = this.writeDatabase.connection.getRepository(PostMentionPostgresEntity);

    return await repo.count({
      where: { mentionedUserId }
    });
  }

  async markAsRead(mentionId: string, readerUserId: string): Promise<void> {
    // Esta funcionalidad se implementaría con una tabla adicional
    // mention_reads (mention_id, reader_id, read_at)
    // Por ahora, implementamos un log
    console.log(`Marking mention ${mentionId} as read by ${readerUserId}`);
  }

  async deleteByPostId(postId: string): Promise<void> {
    const repo = this.writeDatabase.connection.getRepository(PostMentionPostgresEntity);

    await repo.delete({ postId });
  }

  private mapEntityToDomain(entity: PostMentionPostgresEntity): PostMention {
    const timestamps = Timestamps.from(
      entity.createdAt,
      entity.updatedAt,
      undefined
    );

    return new PostMention(
      entity.id,
      entity.postId,
      entity.mentionedUserId,
      entity.mentionerUserId,
      timestamps
    );
  }
}