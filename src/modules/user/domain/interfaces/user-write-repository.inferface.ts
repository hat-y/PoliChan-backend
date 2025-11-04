import { User } from '../entities/user.entity';

export interface UserWriteRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByUserName(userName: string): Promise<User | null>;
}
