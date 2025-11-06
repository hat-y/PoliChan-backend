import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserPostgresEntity } from './user-postgres.entity';
import { PostPostgresEntity } from './post-postgres.entity';

@Entity('comments')
export class CommentPostgresEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ name: 'post_id', type: 'uuid' })
  postId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'text' })
  content: string;

  @Column('text', { array: true, default: () => 'ARRAY[]::text[]' })
  likes: string[]

  @Column({ type: 'int', default: 0 })
  likesCount: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => PostPostgresEntity, { lazy: true })
  @JoinColumn({ name: 'post_id' })
  post: Promise<PostPostgresEntity>;

  @ManyToOne(() => UserPostgresEntity, { lazy: true })
  @JoinColumn({ name: 'user_id' })
  user: Promise<UserPostgresEntity>;
}
