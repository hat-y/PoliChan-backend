import { FastifyRequest, FastifyReply } from 'fastify';

import { MessageBus } from '../../../../shared/domain/message-bus';

import { GetUserMentionsQuery } from '../../application/queries/get-user-mentions.query';
import { GetMentionCountQuery } from '../../application/queries/get-mention-count.query';
import { GetPostMentionsQuery } from '../../application/queries/get-post-mentions.query';

export class MentionsController {
  constructor(private messageBus: MessageBus) {}

  async getUserMentions(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { userId } = req.params as { userId: string };
      const {
        limit = '20',
        offset = '0',
        includeRead = 'false',
        fromDate,
        toDate
      } = req.query as {
        limit?: string;
        offset?: string;
        includeRead?: string;
        fromDate?: string;
        toDate?: string;
      };

      console.log(`Getting mentions for user ${userId}`, {
        limit,
        offset,
        includeRead
      });

      // Validar parámetros
      if (!userId) {
        reply.status(400).send({
          error: 'userId es requerido'
        });
        return;
      }

      const limitNum = parseInt(limit, 10);
      const offsetNum = parseInt(offset, 10);
      const parsedLimit = Math.min(isNaN(limitNum) ? 20 : limitNum, 100);
      const parsedOffset = Math.max(isNaN(offsetNum) ? 0 : offsetNum, 0);

      const query = GetUserMentionsQuery.create(userId, {
        limit: parsedLimit,
        offset: parsedOffset,
        includeRead: includeRead === 'true',
        fromDate: fromDate ? new Date(fromDate) : undefined,
        toDate: toDate ? new Date(toDate) : undefined
      });

      const mentions = await this.messageBus.executeQuery(query) as any[];

      const hasMore = mentions.length === parsedLimit;

      reply.send({
        mentions,
        pagination: {
          limit: parsedLimit,
          offset: parsedOffset,
          hasMore
        }
      });

    } catch (error) {
      console.error('Error in getUserMentions:', error);
      req.log.error(error instanceof Error ? error : new Error('Unknown error'), 'Failed to get user mentions');
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getMentionCount(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { userId } = req.params as { userId: string };
      const { includeRead = 'false' } = req.query as { includeRead?: string };

      if (!userId) {
        reply.status(400).send({
          error: 'userId es requerido'
        });
        return;
      }

      const query = GetMentionCountQuery.create(userId, includeRead === 'true');

      const counts = await this.messageBus.executeQuery(query);

      reply.send(counts);

    } catch (error) {
      console.error('Error in getMentionCount:', error);
      req.log.error(error instanceof Error ? error : new Error('Unknown error'), 'Failed to get mention count');
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getPostMentions(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { postId } = req.params as { postId: string };
      const { limit = '50', offset = '0' } = req.query as { limit?: string; offset?: string };

      if (!postId) {
        reply.status(400).send({
          error: 'postId es requerido'
        });
        return;
      }

      const limitNum = parseInt(limit, 10);
      const offsetNum = parseInt(offset, 10);
      const parsedLimit = Math.min(isNaN(limitNum) ? 50 : limitNum, 100);
      const parsedOffset = Math.max(isNaN(offsetNum) ? 0 : offsetNum, 0);

      const query = GetPostMentionsQuery.create(postId, {
        limit: parsedLimit,
        offset: parsedOffset
      });

      const mentions = await this.messageBus.executeQuery(query) as any[];

      const hasMore = mentions.length === parsedLimit;

      reply.send({
        mentions,
        pagination: {
          limit: parsedLimit,
          offset: parsedOffset,
          hasMore
        }
      });

    } catch (error) {
      console.error('Error in getPostMentions:', error);
      req.log.error(error instanceof Error ? error : new Error('Unknown error'), 'Failed to get post mentions');
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async markMentionAsRead(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { mentionId } = req.params as { mentionId: string };
      const { userId } = req.body as { userId?: string };

      if (!mentionId || !userId) {
        reply.status(400).send({
          error: 'mentionId y userId son requeridos'
        });
        return;
      }

      reply.status(501).send({
        error: 'Funcionalidad no implementada aún'
      });

    } catch (error) {
      console.error('Error in markMentionAsRead:', error);
      req.log.error(error instanceof Error ? error : new Error('Unknown error'), 'Failed to mark mention as read');
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}