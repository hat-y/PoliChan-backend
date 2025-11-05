import { UserMongoEntity } from '../../../../shared/infrastructure/mongo/entities/user-mongo.entity';
import { ReadDatabase } from '../../../../shared/infrastructure/mongo/read-database';
import { UserReadModel } from '../../domain/interfaces/user-read-model.interface';
import { UserReadRepository } from '../../domain/interfaces/user-read-repository.interface';

export class MongoUserReadRepository implements UserReadRepository {
  constructor(private readDataBase: ReadDatabase) {}

  async findById(id: string): Promise<UserReadModel | null> {
    const userRepo =
      this.readDataBase.connection.getMongoRepository(UserMongoEntity);
    const user = await userRepo.findOneBy({ id });
    return user
      ? {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          password: user.password,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      : null;
  }

  async finByUserName(userName: string): Promise<UserReadModel | null> {
    const userRepo =
      this.readDataBase.connection.getMongoRepository(UserMongoEntity);
    const user = await userRepo.findOneBy({ userName });
    return user
      ? {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          password: user.password,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      : null;
  }

  async findAll(): Promise<UserReadModel[]> {
    const userRepo =
      this.readDataBase.connection.getMongoRepository(UserMongoEntity);
    const users = await userRepo.find();
    console.log('MongoUserReadRepository.findAll retrieved users:', users);
    return users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async save(user: UserReadModel): Promise<void> {
    console.log('MongoUserReadRepository.save called with user:', user);
    const userRepo =
      this.readDataBase.connection.getMongoRepository(UserMongoEntity);
    const userExists = await userRepo.findOneBy({ id: user.id });
    if (!userExists) {
      await userRepo.insertOne({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } else {
      await userRepo.updateOne(
        { id: user.id },
        {
          $set: {
            userName: user.userName,
            updatedAt: user.updatedAt,
          },
        }
      );
    }
  }
}
