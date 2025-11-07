import { Entity, PrimaryColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { UserPostgresEntity } from './user-postgres.entity';
import { PostPostgresEntity } from './post-postgres.entity';

@Entity('post_mentions')
@Index(['postId'])  // Optimiza queries por post
@Index(['mentionedUserId'])  // Optimiza queries para notificaciones
@Index(['mentionerUserId'])  // Optimiza queries para analíticas
@Index(['createdAt'])  // Optimiza ordenamiento temporal
@Index(['postId', 'mentionedUserId'], { unique: true })  // Previene duplicados
export class PostMentionPostgresEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ name: 'post_id', type: 'uuid' })
  postId: string;

  @Column({ name: 'mentioned_user_id', type: 'uuid' })
  mentionedUserId: string;

  @Column({ name: 'mentioner_user_id', type: 'uuid' })
  mentionerUserId: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relaciones (opcional, para queries JOIN si se necesitan)
  @ManyToOne(() => PostPostgresEntity, { lazy: true })
  @JoinColumn({ name: 'post_id' })
  post: Promise<PostPostgresEntity>;

  @ManyToOne(() => UserPostgresEntity, { lazy: true })
  @JoinColumn({ name: 'mentioned_user_id' })
  mentionedUser: Promise<UserPostgresEntity>;

  @ManyToOne(() => UserPostgresEntity, { lazy: true })
  @JoinColumn({ name: 'mentioner_user_id' })
  mentionerUser: Promise<UserPostgresEntity>;
}