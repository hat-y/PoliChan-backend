import { UserReadModel } from './user-read-model.interface';

// User Read Repository Interface
export interface UserRepository {
  // save(user: User): Promise<void>;
  // findByEmail(email: string): Promise<User | null>;
  // findAll(): Promise<User[]>;
  // delete(id: string): Promise<void>;
  // existsByEmail(email: string): Promise<boolean>;
  findById(id: string): Promise<UserReadModel | null>;
  findAll(): Promise<UserReadModel[]>;
  finByEmail(email: string): Promise<UserReadModel | null>;
}
