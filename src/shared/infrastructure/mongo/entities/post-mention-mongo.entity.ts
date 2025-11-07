import { Entity, ObjectIdColumn, Column, ObjectId } from 'typeorm';

@Entity('post_mentions')
export class PostMentionMongoEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column('text')
  id: string;

  @Column('text')
  postId: string;

  @Column('text')
  mentionedUserId: string;

  @Column('text')
  mentionerUserId: string;

  @Column('json')
  post?: {
    id: string;
    content: string;
    createdAt: Date;
  };

  @Column('json')
  mentionedUser?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  };

  @Column('json')
  mentionerUser?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  };

  @Column('boolean')
  isRead: boolean;

  @Column('json')
  engagementStats?: {
    likesCount: number;
    commentsCount: number;
  };

  @Column('json')
  timestamps: {
    createdAt: Date;
    updatedAt: Date;
  };
}