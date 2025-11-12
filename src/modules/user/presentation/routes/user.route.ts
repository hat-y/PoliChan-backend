import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/user.controller';

export async function userRoutes(
  fastify: FastifyInstance,
  userController: UserController
) {
  fastify.post('/api/user/register', (req, reply) =>
    userController.registerUser(req, reply)
  );
  fastify.post('/api/user/login', (req, reply) =>
    userController.loginUser(req, reply)
  );
  fastify.put(
    '/api/user/:userId',
    { preHandler: [fastify.authenticate] },
    (req, reply) => userController.updateUser(req, reply)
  );
  fastify.get(
    '/api/user/:userId',
    { preHandler: [fastify.authenticate] },
    (req, reply) => userController.findUser(req, reply)
  );
  fastify.get(
    '/api/user',
    { preHandler: [fastify.authenticate] },
    (req, reply) => userController.getAllUsers(req, reply)
  );
}
