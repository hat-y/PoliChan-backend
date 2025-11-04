import { UserController } from './presentation/controllers/user.controller';
import { MessageBus } from '../../shared/domain/message-bus';

export class UserModule {
  private static userController: UserController;

  public static initialize(messageBus: MessageBus): UserController {
    this.userController = new UserController(messageBus);
    return this.userController;
  }

  public static getUserController(): UserController {
    if (!this.userController) {
      throw new Error('UserModule not initialized. Call initialize() first.');
    }
    return this.userController;
  }
}
