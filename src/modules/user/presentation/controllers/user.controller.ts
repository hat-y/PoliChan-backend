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
      const { firstName, lastName, userName, password } = req.body as {
        firstName?: string;
        lastName?: string;
        userName?: string;
        password?: string;
      };

      if (!firstName || !lastName || !userName || !password) {
        reply.status(400).send({
          error: 'firstName, lastName, userName y password son requeridos',
        });
        return;
      }

      const userId = v4();
      const command = new RegisterUserCommand(
        v4(),
        userId,
        firstName,
        lastName,
        userName,
        password
      );

      await this.messageBus.executeCommand(command);

      reply.status(201).send({
        message: 'Usuario creado exitosamente',
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
      const { userName } = req.body as {
        userName?: string;
      };

      if (!userName) {
        reply
          .status(400)
          .send({ error: 'firstName, lastName y userName son requeridos' });
        return;
      }

      const command = new UpdateUserCommand(v4(), userId, userName);

      await this.messageBus.executeCommand(command);

      reply.status(200).send({
        message: 'Usuario actualizado exitosamente',
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
        reply
          .status(404)
          .send({ error: `Usuario con id ${userId} no encontrado` });
        return;
      }

      // El read model solo debe devolver fullName, userName, etc.
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

      // El read model solo debe devolver fullName, userName, etc.
      reply.status(200).send(users);
    } catch (error) {
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
