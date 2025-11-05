import { Timestamps } from "../../../../shared/domain/datetime";

export interface PostReadModel {
  id: string;
  userId: string;
  content: string;
  likesCount: number;
  timestamps: Timestamps
}


