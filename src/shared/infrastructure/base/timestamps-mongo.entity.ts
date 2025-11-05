import { CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';

export abstract class TimestampsMongoEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}