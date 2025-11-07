import { PostMentionReadModel, GetUserMentionsQuery, GetPostMentionsQuery } from './post-mention-read-model.interface';

export interface PostMentionReadRepository {
  /**
   * Guarda o actualiza una mención en el read model
   */
  save(mention: PostMentionReadModel): Promise<void>;

  /**
   * Actualiza una mención existente
   */
  update(mention: PostMentionReadModel): Promise<void>;

  /**
   * Obtiene las menciones de un usuario
   */
  getUserMentions(query: GetUserMentionsQuery): Promise<PostMentionReadModel[]>;

  /**
   * Obtiene las menciones de un post específico
   */
  getPostMentions(query: GetPostMentionsQuery): Promise<PostMentionReadModel[]>;

  /**
   * Cuenta las menciones de un usuario
   */
  countUserMentions(userId: string, includeRead?: boolean): Promise<number>;

  /**
   * Cuenta las menciones no leídas de un usuario
   */
  findUnreadCount(userId: string): Promise<number>;

  /**
   * Marca una mención como leída
   */
  markAsRead(mentionId: string, userId: string): Promise<void>;

  /**
   * Marca todas las menciones de un usuario como leídas
   */
  markAllAsRead(userId: string): Promise<void>;

  /**
   * Elimina menciones cuando se elimina un post
   */
  deleteByPostId(postId: string): Promise<void>;
}