// External Modules
import { FastifyRequest, FastifyReply } from 'fastify';
import { v4 } from 'uuid';

// Internal Modules
import { MessageBus } from '../../../../shared/domain/message-bus';

// Commands
import { CreateCommentCommand } from '../../application/commands/create-comment.command';
import { LikeCommentCommand } from '../../application/commands/like-comment.command';
import { UnlikeCommentCommand } from '../../application/commands/unlike-comment.command';
import { DeleteCommentCommand } from '../../application/commands/delete-comment.command';

// Queries
import { FindCommentQuery } from '../../application/queries/find-comment.query';
import { FindCommentsByPostQuery } from '../../application/queries/find-comments-by-post.query';

export class CommentsController {
  constructor(private messageBus: MessageBus) { }

  // ==== COMMANDS ====

  async createComment(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { postId, content, userId } = req.body as {
        postId?: string;
        content?: string;
        userId?: string;
      };

      if (!postId || !content || !userId) {
        reply.status(400).send({
          error: 'postId, content y userId son requeridos',
        });
        return;
      }

      if (content.length > 280) {
        reply.status(400).send({
          error: 'El contenido no puede exceder los 280 caracteres',
        });
        return;
      }

      const command = new CreateCommentCommand(v4(), postId, userId, content);

      await this.messageBus.executeCommand(command);

      reply.status(201).send({
        message: 'Comment creado exitosamente',
      });
    } catch (error) {
      req.log.error(error instanceof Error ? error : new Error('Unknown error'), 'Failed to create comment');
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async likeComment(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { commentId } = req.params as { commentId: string };
      const { userId } = req.body as { userId?: string };

      if (!commentId || !userId) {
        reply.status(400).send({
          error: 'commentId y userId son requeridos',
        });
        return;
      }

      const command = new LikeCommentCommand(v4(), commentId, userId);

      await this.messageBus.executeCommand(command);

      reply.send({
        message: 'Comment liked exitosamente',
      });
    } catch (error) {
      req.log.error(error instanceof Error ? error : new Error('Unknown error'), 'Failed to like comment');
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async unlikeComment(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { commentId } = req.params as { commentId: string };
      const { userId } = req.body as { userId?: string };

      if (!commentId || !userId) {
        reply.status(400).send({
          error: 'commentId y userId son requeridos',
        });
        return;
      }

      const command = new UnlikeCommentCommand(v4(), commentId, userId);

      await this.messageBus.executeCommand(command);

      reply.send({
        message: 'Comment unliked exitosamente',
      });
    } catch (error) {
      req.log.error(error instanceof Error ? error : new Error('Unknown error'), 'Failed to unlike comment');
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async deleteComment(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { commentId } = req.params as { commentId: string };
      const { userId } = req.body as { userId?: string };

      if (!commentId || !userId) {
        reply.status(400).send({
          error: 'commentId y userId son requeridos',
        });
        return;
      }

      const command = new DeleteCommentCommand(v4(), commentId, userId);

      await this.messageBus.executeCommand(command);

      reply.send({
        message: 'Comment deleted exitosamente',
      });
    } catch (error) {
      req.log.error(error instanceof Error ? error : new Error('Unknown error'), 'Failed to delete comment');
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  // ==== QUERIES ====

  async getComment(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { commentId } = req.params as { commentId: string };

      if (!commentId) {
        reply.status(400).send({
          error: 'commentId es requerido',
        });
        return;
      }

      const query = new FindCommentQuery(v4(), commentId);
      const comment = await this.messageBus.executeQuery(query);

      if (!comment) {
        reply.status(404).send({ error: 'Comment not found' });
        return;
      }

      reply.send(comment);
    } catch (error) {
      req.log.error(error instanceof Error ? error : new Error('Unknown error'), 'Failed to get comment');
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async getCommentsByPost(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { postId } = req.params as { postId: string };
      const { limit = 50, offset = 0 } = req.query as {
        limit?: number;
        offset?: number;
      };

      if (!postId) {
        reply.status(400).send({
          error: 'postId es requerido',
        });
        return;
      }

      if (limit > 100) {
        reply.status(400).send({
          error: 'El límite no puede ser mayor a 100',
        });
        return;
      }

      const query = new FindCommentsByPostQuery(v4(), postId, limit, offset);
      const comments = await this.messageBus.executeQuery(query);

      reply.send(comments);
    } catch (error) {
      req.log.error(error instanceof Error ? error : new Error('Unknown error'), 'Failed to get comments by post');
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
}
