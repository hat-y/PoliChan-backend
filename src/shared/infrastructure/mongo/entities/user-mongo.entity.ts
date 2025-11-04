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

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  userName!: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
