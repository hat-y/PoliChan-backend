import { CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';

export abstract class TimestampsPostgresEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}