import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('users')
export class UserMongoEntity {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column({ type: 'string', unique: true })
  email!: string;

  @Column({ type: 'string' })
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
