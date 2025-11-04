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
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      password: user.password,
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
          entity.firstName,
          entity.lastName,
          entity.userName,
          entity.password,
          entity.createdAt,
          entity.updatedAt
        )
      : null;
  }

  async findByUserName(userName: string): Promise<User | null> {
    const repo =
      this.writeDataBase.connection.getRepository(UserPostgresEntity);
    const entity = await repo.findOneBy({ userName });
    return entity
      ? new User(
          entity.id,
          entity.firstName,
          entity.lastName,
          entity.userName,
          entity.password,
          entity.createdAt,
          entity.updatedAt
        )
      : null;
  }
}
