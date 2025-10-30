import { UserController } from './presentation/controllers/user.controller';
import { CreateUserCommand } from './application/commands/create-user.command';
import { GetAllUsersQuery } from './application/queries/get-all-users.query';
import { InMemoryUserRepository } from './infrastructure/repositories/in-memory.repository';

export class UserModule {
  private static userRepository: InMemoryUserRepository;
  private static createUserCommand: CreateUserCommand;
  private static getAllUsersQuery: GetAllUsersQuery;
  private static userController: UserController;

  public static initialize(): UserController {
    this.userRepository = new InMemoryUserRepository();
    this.createUserCommand = new CreateUserCommand(this.userRepository);
    this.getAllUsersQuery = new GetAllUsersQuery(this.userRepository);
    this.userController = new UserController(
      this.createUserCommand,
      this.getAllUsersQuery
    );

    return this.userController;
  }

  public static getUserController(): UserController {
    if (!this.userController) {
      throw new Error('UserModule not initialized. Call initialize() first.');
    }
    return this.userController;
  }

  public static reset(): void {
    if (this.userRepository) {
      this.userRepository.clear();
    }
    this.userRepository = null!;
    this.createUserCommand = null!;
    this.getAllUsersQuery = null!;
    this.userController = null!;
  }
}