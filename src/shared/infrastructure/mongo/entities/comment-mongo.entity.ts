import { Entity, ObjectId, ObjectIdColumn, Column, Index } from 'typeorm';

@Entity('comments')
export class CommentMongoEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  postId: string;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  userId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'number', default: 0 })
  likesCount: number;

  @Column({ type: 'json', nullable: true })
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  };

  @Column({ type: 'json' })
  timestamps: {
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  };
}
