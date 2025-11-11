import { FastifyInstance } from 'fastify';
import { CommentsController } from '../controllers/comments.controller';

export async function commentsRoutes(
  fastify: FastifyInstance,
  commentsController: CommentsController
) {
  fastify.post('/api/comments', (req, reply) =>
    commentsController.createComment(req, reply)
  );
  fastify.post('/api/comments/:commentId/like', (req, reply) =>
    commentsController.likeComment(req, reply)
  );
  fastify.post('/api/comments/:commentId/unlike', (req, reply) =>
    commentsController.unlikeComment(req, reply)
  );
  fastify.delete('/api/comments/:commentId', (req, reply) =>
    commentsController.deleteComment(req, reply)
  );
  fastify.get('/api/comments/:commentId', (req, reply) =>
    commentsController.getComment(req, reply)
  );
  fastify.get('/api/posts/:postId/comments', (req, reply) =>
    commentsController.getCommentsByPost(req, reply)
  );
  fastify.get('/api/posts/:postId/comments/count', (req, reply) =>
    commentsController.getCommentsCountByPost(req, reply)
  );
}
