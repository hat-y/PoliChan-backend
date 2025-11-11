import { FastifyInstance } from 'fastify';
import { PostController } from '../controllers/post.controller';

export async function postRoutes(
  fastify: FastifyInstance,
  postController: PostController
) {
  fastify.post('/api/posts', (req, reply) =>
    postController.createPost(req, reply)
  );
  fastify.delete('/api/posts/:postId', (req, reply) =>
    postController.deletePost(req, reply)
  );
  fastify.post('/api/posts/:postId/like', (req, reply) =>
    postController.likePost(req, reply)
  );
  fastify.post('/api/posts/:postId/unlike', (req, reply) =>
    postController.unlikePost(req, reply)
  );
  fastify.get('/api/posts/:postId', (req, reply) =>
    postController.getPost(req, reply)
  );
  fastify.get('/api/posts', (req, reply) =>
    postController.getAllPosts(req, reply)
  );
  fastify.get('/api/posts/user/:userId', (req, reply) =>
    postController.getPostsByUser(req, reply)
  );
  fastify.get('/api/posts/timeline', (req, reply) =>
    postController.getTimeline(req, reply)
  );
  fastify.get('/api/posts/user/:userId/timeline', (req, reply) =>
    postController.getUserTimeline(req, reply)
  );
  fastify.get('/api/posts/most-liked', (req, reply) =>
    postController.getMostLikedPosts(req, reply)
  );
  fastify.get('/api/posts/by-likes', (req, reply) =>
    postController.getPostsByLikesRange(req, reply)
  );
}
