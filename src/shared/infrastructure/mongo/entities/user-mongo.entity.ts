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
  _id: ObjectId;

  @Column('text')
  id: string;

  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column('text')
  userName: string;

  @Column('text')
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
