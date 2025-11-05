import { Timestamps } from '../../../../shared/domain/datetime';

export interface PostReadModel {
  id: string;
  userId: string;
  content: string;
  likes: string[];
  likesCount: number;
  timestamps: Timestamps;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
}
