import { User } from '../entities/user.entity';
import { UserReadModel } from './user-read-model.interface';

// User Read Repository Interface
export interface UserReadRepository {
  findById(id: string): Promise<UserReadModel | null>;
  findAll(): Promise<UserReadModel[]>;
  finByUserName(userName: string): Promise<UserReadModel | null>;
  save(user: User): Promise<void>;
}
