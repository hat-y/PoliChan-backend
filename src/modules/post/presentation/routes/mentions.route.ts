import { FastifyInstance } from 'fastify';
import { MentionsController } from '../controllers/mentions.controller';

export async function mentionsRoutes(
  fastify: FastifyInstance,
  mentionsController: MentionsController
) {
  fastify.get('/api/users/:userId/mentions', (req, reply) =>
    mentionsController.getUserMentions(req, reply)
  );
  fastify.get('/api/users/:userId/mentions/count', (req, reply) =>
    mentionsController.getMentionCount(req, reply)
  );
  fastify.get('/api/posts/:postId/mentions', (req, reply) =>
    mentionsController.getPostMentions(req, reply)
  );
  fastify.put('/api/mentions/:mentionId/read', (req, reply) =>
    mentionsController.markMentionAsRead(req, reply)
  );
}
