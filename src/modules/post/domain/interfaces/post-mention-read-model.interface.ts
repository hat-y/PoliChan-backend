import { Timestamps } from "../../../../shared/domain/datetime";

export interface PostMentionReadModel {
  id: string;
  postId: string;
  mentionedUserId: string;
  mentionerUserId: string;
  timestamps: Timestamps;

  // Información enriquecida para display (optimizada para consultas)
  post?: {
    id: string;
    content: string;
    createdAt: Date;
  };

  mentionedUser?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  };

  mentionerUser?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  };

  // Metadata útiles para UI
  isRead?: boolean;        // Futuro: cuando el usuario vio la mención
  engagementStats?: {      // Futuro: engagement del post
    likesCount: number;
    commentsCount: number;
  };
}

// Interfaces para queries específicas de menciones
export interface GetUserMentionsQuery {
  userId: string;
  limit?: number;
  offset?: number;
  includeRead?: boolean;
  fromDate?: Date;
  toDate?: Date;
}

export interface GetPostMentionsQuery {
  postId: string;
  limit?: number;
  offset?: number;
}

export interface GetUserMentionStatsQuery {
  userId: string;
  timeframe: 'day' | 'week' | 'month' | 'year';
}