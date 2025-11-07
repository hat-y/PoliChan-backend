import { PostMention } from '../entity/post-mention.entity';

export interface PostMentionWriteRepository {
  /**
   * Guarda una nueva mención
   */
  save(mention: PostMention): Promise<void>;

  /**
   * Guarda múltiples menciones en batch (más eficiente)
   */
  saveMany(mentions: PostMention[]): Promise<void>;

  /**
   * Encuentra todas las menciones de un post específico
   * Útil para validaciones (ej: límite de menciones por post)
   */
  findByPostId(postId: string): Promise<PostMention[]>;

  /**
   * Encuentra menciones donde el usuario fue mencionado
   * Útil para notificaciones y feed de menciones
   */
  findByMentionedUserId(mentionedUserId: string, limit?: number, offset?: number): Promise<PostMention[]>;

  /**
   * Verifica si un usuario ya fue mencionado en un post específico
   * Previene menciones duplicadas
   */
  exists(postId: string, mentionedUserId: string): Promise<boolean>;

  /**
   * Cuenta menciones de un usuario (para analíticas)
   */
  countMentionsOfUser(mentionedUserId: string): Promise<number>;

  /**
   * Marca menciones como leídas (funcionalidad futura)
   */
  markAsRead(mentionId: string, readerUserId: string): Promise<void>;

  /**
   * Elimina menciones cuando se elimina un post
   */
  deleteByPostId(postId: string): Promise<void>;
}