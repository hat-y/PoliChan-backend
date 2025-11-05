import { Column, Entity, ObjectIdColumn } from "typeorm";
import { ObjectId } from 'mongodb';
import { TimestampsMongoEntity } from "../../../../shared/infrastructure/base/timestamps-mongo.entity";

@Entity('posts')
export class PostMongoEntity extends TimestampsMongoEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column('text')
  id: string;

  @Column('text')
  userId: string;

  @Column('text')
  content: string;

  @Column('integer')
  likesCount: number;

  @Column('simple-json', { nullable: true })
  user?: {
    id: string,
    firstName: string,
    lastName: string,
    username: string
  }
}
