// External Modules
import { FastifyRequest, FastifyReply } from 'fastify';
import { v4 } from 'uuid';

// Internal Modules
import { MessageBus } from '../../../../shared/domain/message-bus';
import { PostReadModel } from '../../domain/interfaces/post-read-model.interface';

// Commands
import { CreatePostCommand } from '../../application/commands/create-post.command';
import { DeletePostCommand } from '../../application/commands/delete-post.command';
import { LikePostCommand } from '../../application/commands/like-post.command';
import { UnlikePostCommand } from '../../application/commands/unlike-post.command';

// Queries
import { FindPostQuery } from '../../application/queries/find-post.query';
import { GetAllPostsQuery } from '../../application/queries/get-all-posts.query';
import { FindPostsByUserQuery } from '../../application/queries/find-posts-by-user.query';
import { GetTimelineQuery } from '../../application/queries/get-timeline.query';
import { GetUserTimelineQuery } from '../../application/queries/get-user-timeline.query';
import { GetMostLikedPostsQuery } from '../../application/queries/get-most-liked-posts.query';
import { FindPostsByLikesRangeQuery } from '../../application/queries/find-posts-by-likes-range.query';

export class PostController {
  constructor(private messageBus: MessageBus) { }

  // ==== COMMANDS ====

  async createPost(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { userId, content } = req.body as {
        userId?: string;
        content?: string;
      };

      req.log.debug({ userId, contentLength: content?.length }, 'Creating post request received');

      if (!userId || !content) {
        req.log.warn({ userId: !!userId, content: !!content }, 'Validation failed: missing required fields');
        reply.status(400).send({
          error: 'userId y content son requeridos',
        });
        return;
      }

      if (content.length > 280) {
        req.log.warn({ contentLength: content.length }, 'Validation failed: content too long');
        reply.status(400).send({
          error: 'El contenido no puede exceder los 280 caracteres',
        });
        return;
      }

      const command = new CreatePostCommand(v4(), userId, content);

      req.log.info({ commandId: command.commandId, userId }, 'Executing CreatePostCommand');
      await this.messageBus.executeCommand(command);

      reply.status(201).send({
        message: 'Post creado exitosamente',
      });
    } catch (error) {
      req.log.error(error instanceof Error ? error : new Error('Unknown error'), 'Failed to create post');
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async deletePost(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    
    try {
      const { postId } = req.params as { postId: string };

      req.log.debug({ postId }, 'Delete post request received');

      if (!postId) {
        req.log.warn({}, 'Validation failed: missing postId');
        reply.status(400).send({
          error: 'postId es requerido',
        });
        return;
      }

      const command = new DeletePostCommand(v4(), postId);

      req.log.info({ commandId: command.commandId, postId }, 'Executing DeletePostCommand');
      await this.messageBus.executeCommand(command);

      reply.status(200).send({
        message: 'Post eliminado exitosamente',
      });
    } catch (error) {
      req.log.error(error instanceof Error ? error : new Error('Unknown error'), 'Failed to delete post');
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async likePost(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    
    try {
      const { postId } = req.params as { postId: string };
      const { userId } = req.body as { userId?: string };

      req.log.debug({ postId, userId }, 'Like post request received');

      if (!postId || !userId) {
        req.log.warn({ postId: !!postId, userId: !!userId }, 'Validation failed: missing required fields');
        reply.status(400).send({
          error: 'postId y userId son requeridos',
        });
        return;
      }

      const command = new LikePostCommand(v4(), postId, userId);

      req.log.info({ commandId: command.commandId, postId, userId }, 'Executing LikePostCommand');
      await this.messageBus.executeCommand(command);

      reply.status(200).send({
        message: 'Like agregado exitosamente',
      });
    } catch (error) {
      req.log.error(error instanceof Error ? error : new Error('Unknown error'), 'Failed to like post');
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async unlikePost(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    
    try {
      const { postId } = req.params as { postId: string };
      const { userId } = req.body as { userId?: string };

      req.log.debug({ postId, userId }, 'Unlike post request received');

      if (!postId || !userId) {
        req.log.warn({ postId: !!postId, userId: !!userId }, 'Validation failed: missing required fields');
        reply.status(400).send({
          error: 'postId y userId son requeridos',
        });
        return;
      }

      const command = new UnlikePostCommand(v4(), postId, userId);

      req.log.info({ commandId: command.commandId, postId, userId }, 'Executing UnlikePostCommand');
      await this.messageBus.executeCommand(command);

      reply.status(200).send({
        message: 'Like removido exitosamente',
      });
    } catch (error) {
      req.log.error(error instanceof Error ? error : new Error('Unknown error'), 'Failed to unlike post');
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  // ==== QUERIES ====

  async getPost(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    
    try {
      const { postId } = req.params as { postId: string };

      req.log.debug({  postId }, 'Get post request received');

      if (!postId) {
        req.log.warn({}, 'Validation failed: missing postId');
        reply.status(400).send({
          error: 'postId es requerido',
        });
        return;
      }

      const query = new FindPostQuery(v4(), postId);

      req.log.info({  queryId: query.queryId, postId }, 'Executing FindPostQuery');
      const post = await this.messageBus.executeQuery<FindPostQuery, PostReadModel | null>(query);

      if (!post) {
        req.log.warn({  postId }, 'Post not found');
        reply.status(404).send({
          error: `Post con id ${postId} no encontrado`,
        });
        return;
      }

      reply.status(200).send(post);
    } catch (error) {
      req.log.error(error instanceof Error ? error : new Error('Unknown error'), 'Failed to get post');
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async getAllPosts(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    
    try {
      const { limit = 50, offset = 0 } = req.query as {
        limit?: number;
        offset?: number;
      };

      req.log.debug({  limit, offset }, 'Get all posts request received');

      const query = new GetAllPostsQuery(v4(), limit, offset);

      req.log.info({ queryId: query.queryId, limit, offset }, 'Executing GetAllPostsQuery');
      const posts = await this.messageBus.executeQuery<GetAllPostsQuery, PostReadModel[]>(query);

      reply.status(200).send({
        posts,
        pagination: {
          limit,
          offset,
          total: posts.length,
        },
      });
    } catch (error) {
      req.log.error(error instanceof Error ? error : new Error('Unknown error'), 'Failed to get all posts');
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async getPostsByUser(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    
    try {
      const { userId } = req.params as { userId: string };
      const { limit = 50, offset = 0 } = req.query as {
        limit?: number;
        offset?: number;
      };

      req.log.debug({  userId, limit, offset }, 'Get posts by user request received');

      if (!userId) {
        req.log.warn({}, 'Validation failed: missing userId');
        reply.status(400).send({
          error: 'userId es requerido',
        });
        return;
      }

      const query = new FindPostsByUserQuery(v4(), userId, limit);

      req.log.info({  queryId: query.queryId, userId, limit }, 'Executing FindPostsByUserQuery');
      const posts = await this.messageBus.executeQuery<FindPostsByUserQuery, PostReadModel[]>(query);

      reply.status(200).send({
        posts,
        pagination: {
          limit,
          offset,
          total: posts.length,
        },
      });
    } catch (error) {
      req.log.error(error instanceof Error ? error : new Error('Unknown error'), 'Failed to get posts by user');
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async getTimeline(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    
    try {
      const { afterPostId, limit = 50 } = req.query as {
        afterPostId?: string;
        limit?: number;
      };

      req.log.debug({  afterPostId, limit }, 'Get timeline request received');

      const query = new GetTimelineQuery(v4(), afterPostId, limit);

      req.log.info({  queryId: query.queryId, afterPostId, limit }, 'Executing GetTimelineQuery');
      const posts = await this.messageBus.executeQuery<GetTimelineQuery, PostReadModel[]>(query);

      reply.status(200).send({
        posts,
        pagination: {
          limit,
          afterPostId,
          total: posts.length,
        },
      });
    } catch (error) {
      req.log.error(error instanceof Error ? error : new Error('Unknown error'), 'Failed to get timeline');
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async getUserTimeline(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    
    try {
      const { userId } = req.params as { userId: string };
      const { afterPostId, limit = 50 } = req.query as {
        afterPostId?: string;
        limit?: number;
      };

      req.log.debug({  userId, afterPostId, limit }, 'Get user timeline request received');

      if (!userId) {
        req.log.warn({}, 'Validation failed: missing userId');
        reply.status(400).send({
          error: 'userId es requerido',
        });
        return;
      }

      const query = new GetUserTimelineQuery(v4(), userId, afterPostId, limit);

      req.log.info({  queryId: query.queryId, userId, afterPostId, limit }, 'Executing GetUserTimelineQuery');
      const posts = await this.messageBus.executeQuery<GetUserTimelineQuery, PostReadModel[]>(query);

      reply.status(200).send({
        posts,
        pagination: {
          limit,
          afterPostId,
          total: posts.length,
        },
      });
    } catch (error) {
      req.log.error(error instanceof Error ? error : new Error('Unknown error'), 'Failed to get user timeline');
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async getMostLikedPosts(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    
    try {
      const { limit = 20 } = req.query as { limit?: number };

      req.log.debug({  limit }, 'Get most liked posts request received');

      const query = new GetMostLikedPostsQuery(v4(), limit);

      req.log.info({  queryId: query.queryId, limit }, 'Executing GetMostLikedPostsQuery');
      const posts = await this.messageBus.executeQuery<GetMostLikedPostsQuery, PostReadModel[]>(query);

      reply.status(200).send({
        posts,
        pagination: {
          limit,
          total: posts.length,
        },
      });
    } catch (error) {
      req.log.error(error instanceof Error ? error : new Error('Unknown error'), 'Failed to get most liked posts');
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async getPostsByLikesRange(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    
    try {
      const { minLikes, maxLikes, limit = 50 } = req.query as {
        minLikes?: number;
        maxLikes?: number;
        limit?: number;
      };

      req.log.debug({  minLikes, maxLikes, limit }, 'Get posts by likes range request received');

      if (minLikes === undefined || maxLikes === undefined) {
        req.log.warn({  minLikes, maxLikes }, 'Validation failed: missing likes range');
        reply.status(400).send({
          error: 'minLikes y maxLikes son requeridos',
        });
        return;
      }

      if (minLikes < 0 || maxLikes < minLikes) {
        req.log.warn({  minLikes, maxLikes }, 'Validation failed: invalid likes range');
        reply.status(400).send({
          error: 'minLikes debe ser >= 0 y maxLikes debe ser >= minLikes',
        });
        return;
      }

      const query = new FindPostsByLikesRangeQuery(v4(), minLikes, maxLikes, limit);

      req.log.info({  queryId: query.queryId, minLikes, maxLikes, limit }, 'Executing FindPostsByLikesRangeQuery');
      const posts = await this.messageBus.executeQuery<FindPostsByLikesRangeQuery, PostReadModel[]>(query);

      reply.status(200).send({
        posts,
        filters: {
          minLikes,
          maxLikes,
        },
        pagination: {
          limit,
          total: posts.length,
        },
      });
    } catch (error) {
      req.log.error(error instanceof Error ? error : new Error('Unknown error'), 'Failed to get posts by likes range');
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
}
