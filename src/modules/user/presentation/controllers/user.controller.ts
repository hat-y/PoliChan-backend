import { CreateUserCommand, CreateUserRequest } from '../../application/commands/create-user.command';
import { GetAllUsersQuery } from '../../application/queries/get-all-users.query';

export class UserController {
  constructor(
    private readonly createUserCommand: CreateUserCommand,
    private readonly getAllUsersQuery: GetAllUsersQuery
  ) {}

  async createUser(request: CreateUserRequest) {
    try {
      const user = await this.createUserCommand.execute(request);
      return {
        success: true,
        data: user.toJSON(),
        message: 'User created successfully'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to create user'
      };
    }
  }

  async getAllUsers() {
    try {
      const users = await this.getAllUsersQuery.execute();
      const usersData = users.map(user => user.toJSON());
      return {
        success: true,
        data: usersData,
        count: users.length,
        message: 'Users retrieved successfully'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to get users'
      };
    }
  }
}