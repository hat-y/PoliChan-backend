import {
  Entity,
  PrimaryColumn,
  Column,
} from 'typeorm';
import { TimestampsPostgresEntity } from '../../base/timestamps-postgres.entity';

@Entity('posts')
export class PostPostgresEntity extends TimestampsPostgresEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int', default: 0 })
  likesCount: number;
}
