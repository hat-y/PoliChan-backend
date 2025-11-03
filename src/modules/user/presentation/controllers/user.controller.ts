import { FastifyRequest, FastifyReply } from 'fastify';
import { v4 } from 'uuid';
import { MessageBus } from '../../../../shared/domain/message-bus';
import { RegisterUserCommand } from '../../application/commands/register-user.command';
import { UpdateUserCommand } from '../../application/commands/update-user.command';
import { FindUserQuery } from '../../application/queries/find-user.query';
import { GetAllUsersQuery } from '../../application/queries/get-all-users.query';

export class UserController {
  constructor(private messageBus: MessageBus) {}

  async registerUser(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { email, name } = req.body as { email?: string; name?: string };

      if (!email || !name) {
        reply.status(400).send({ error: 'Email and name are required' });
        return;
      }

      const userId = v4();
      const command = new RegisterUserCommand(v4(), userId, email, name);

      await this.messageBus.executeCommand(command);

      reply.status(201).send({
        message: 'User created successfully',
      });
    } catch (error) {
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async updateUser(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { userId } = req.params as { userId: string };
      const { name } = req.body as { name?: string };

      if (!name) {
        reply.status(400).send({ error: 'Name is required' });
        return;
      }

      const command = new UpdateUserCommand(v4(), userId, name);

      await this.messageBus.executeCommand(command);

      reply.status(200).send({
        message: 'User updated successfully',
      });
    } catch (error) {
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async findUser(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { userId } = req.params as { userId: string };

      const query = new FindUserQuery(v4(), userId);

      const user = await this.messageBus.executeQuery(query);

      if (!user) {
        reply.status(404).send({ error: `User with id ${userId} not found` });
        return;
      }

      reply.status(200).send(user);
    } catch (error) {
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getAllUsers(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const query = new GetAllUsersQuery(v4());

      const users = await this.messageBus.executeQuery(query);

      reply.status(200).send(users);
    } catch (error) {
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
