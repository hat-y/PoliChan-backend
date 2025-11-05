import { Column, Entity, ObjectIdColumn } from "typeorm";
import { ObjectId } from 'mongodb';
import { TimestampsMongoEntity } from "../../../../shared/infrastructure/base/timestamps-mongo.entity";

@Entity('posts')
export class PostMongoEntity extends TimestampsMongoEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  id: string;

  @Column({ type: 'text' })
  userId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int', default: 0 })
  likesCount: number;
}
