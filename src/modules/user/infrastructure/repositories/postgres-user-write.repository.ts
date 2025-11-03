import { WriteDatabase } from '../../../../shared/infrastructure/postgres/write-database';
import { User } from '../../domain/entities/user.entity';
import { UserWriteRepository } from '../../domain/interfaces/user-write-repository.inferface';
import { UserPostgresEntity } from '../../../../shared/infrastructure/postgres/entities/user-postgres.entity';

export class PostgresUserWriteRepository implements UserWriteRepository {
  constructor(private writeDataBase: WriteDatabase) {}

  async save(user: User): Promise<void> {
    const repo =
      this.writeDataBase.connection.getRepository(UserPostgresEntity);
    const entity = repo.create({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    await repo.save(entity);
  }

  async findById(id: string): Promise<User | null> {
    const repo =
      this.writeDataBase.connection.getRepository(UserPostgresEntity);
    const entity = await repo.findOneBy({ id });
    return entity
      ? new User(
          entity.id,
          entity.email,
          entity.name,
          entity.createdAt,
          entity.updatedAt
        )
      : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const repo =
      this.writeDataBase.connection.getRepository(UserPostgresEntity);
    const entity = await repo.findOneBy({ email });
    return entity
      ? new User(
          entity.id,
          entity.email,
          entity.name,
          entity.createdAt,
          entity.updatedAt
        )
      : null;
  }
}
