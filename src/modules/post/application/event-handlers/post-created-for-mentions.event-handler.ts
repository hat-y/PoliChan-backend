import { EventHandler } from '../../../../shared/domain/event-handler';
import { PostCreatedEvent } from '../../domain/entity/post.entity';
import { ContentProcessorService } from '../../domain/services/content-processor.service';
import { PostMentionWriteRepository } from '../../domain/interfaces/post-mention-write-repository.interface';
import { PostMention } from '../../domain/entity/post-mention.entity';
import { MessageBus } from '../../../../shared/domain/message-bus';
import { UserMentionedNotificationEvent } from '../../domain/events/user-mentioned-notification.event';
import { randomUUID } from 'crypto';

export class PostCreatedForMentionsEventHandler implements EventHandler<PostCreatedEvent> {
  constructor(
    private contentProcessor: ContentProcessorService,
    private mentionWriteRepository: PostMentionWriteRepository,
    private messageBus: MessageBus
  ) {}

  async handle(event: PostCreatedEvent): Promise<void> {
    console.log(`Processing mentions for post ${event.postId}`);

    try {
      // 1. Procesar contenido para extraer menciones
      const { mentions, invalidMentions, mentionCount, exceedsLimit } =
        await this.contentProcessor.processContentForMentions(
          event.content,
          event.userId
        );

      console.log(`Found ${mentionCount} valid mentions, ${invalidMentions.length} invalid`);

      // 2. Log de menciones inválidas (para debugging)
      if (invalidMentions.length > 0) {
        console.log(`Invalid mentions in post ${event.postId}:`, invalidMentions);
      }

      // 3. Validar límite de menciones
      if (exceedsLimit) {
        console.warn(`Post ${event.postId} exceeds mention limit (${mentionCount} mentions)`);
        // Opcional: podríamos querer limitar a las primeras N menciones
      }

      // 4. Si hay menciones válidas, procesarlas
      if (mentions.length > 0) {
        // 4a. Crear entities de dominio
        const mentionEntities = mentions.map(mention =>
          PostMention.create(event.postId, mention.userId, event.userId)
        ).map(result => result.mention); // Extraer solo la entidad

        // 4b. Validar todas las menciones antes de guardar
        const validMentions = mentionEntities.filter(mention => mention.isValid());

        if (validMentions.length > 0) {
          // 4c. Guardar en batch (más eficiente)
          await this.mentionWriteRepository.saveMany(validMentions);
          console.log(`Saved ${validMentions.length} mentions for post ${event.postId}`);

          // 4d. Enviar notificaciones en paralelo
          const notificationPromises = validMentions.map(mention =>
            this.sendMentionNotification(mention, event.postId, event.userId)
          );

          // Usar Promise.allSettled para que una notificación fallida no afecte a las demás
          const notificationResults = await Promise.allSettled(notificationPromises);

          // Log de notificaciones fallidas
          const failedNotifications = notificationResults.filter(
            result => result.status === 'rejected'
          );

          if (failedNotifications.length > 0) {
            console.warn(
              `Failed to send ${failedNotifications.length} mention notifications for post ${event.postId}`,
              failedNotifications.map(r => r.status === 'rejected' && r.reason)
            );
          }
        }
      }

      console.log(`Mention processing completed for post ${event.postId}`);

    } catch (error) {
      console.error(`Error processing mentions for post ${event.postId}:`, error);

      // Importante: No lanzamos el error para no afectar el flujo principal
      // Las menciones son "nice to have", no "must have"
      // El post ya fue creado, no lo revertimos
    }
  }

  /**
   * Envía notificación de mención
   *
   * Por qué método separado:
   * - Reusabilidad (podría llamarse desde otros lugares)
   * - Testabilidad (más fácil de mockear)
   * - Encapsula la lógica de notificación
   */
  private async sendMentionNotification(
    mention: PostMention,
    postId: string,
    mentionerUserId: string
  ): Promise<void> {
    try {
      // Crear evento de notificación
      const notificationEvent = new UserMentionedNotificationEvent(
        randomUUID(),
        mention.mentionedUserId,
        postId,
        mentionerUserId,
        mention.id
      );

      // Publicar evento de forma asíncrona (non-blocking)
      await this.messageBus.publishEventAsync(notificationEvent);

      console.log(`Mention notification sent: user ${mention.mentionedUserId} mentioned in post ${postId}`);

    } catch (error) {
      console.error(`Failed to send mention notification for ${mention.id}:`, error);
      throw error; // Re-lanzar para que se capture en Promise.allSettled
    }
  }
}