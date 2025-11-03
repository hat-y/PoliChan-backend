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
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      : null;
  }

  async finByEmail(email: string): Promise<UserReadModel | null> {
    const userRepo =
      this.readDataBase.connection.getMongoRepository(UserMongoEntity);
    const user = await userRepo.findOneBy({ email });
    return user
      ? {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      : null;
  }

  async findAll(): Promise<UserReadModel[]> {
    const userRepo =
      this.readDataBase.connection.getMongoRepository(UserMongoEntity);
    const users = await userRepo.find();
    return users.map((user) => ({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async save(user: UserReadModel): Promise<void> {
    let userRepo;
    const userExists = await this.findById(user.id);
    if (!userExists) {
      userRepo =
        this.readDataBase.connection.getMongoRepository(UserMongoEntity);
      await userRepo.insertOne({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    }

    userRepo = this.readDataBase.connection.getMongoRepository(UserMongoEntity);
    await userRepo.updateOne(
      { _id: user.id },
      {
        $set: {
          name: user.name,
          updatedAt: user.updatedAt,
        },
      }
    );
  }
}
