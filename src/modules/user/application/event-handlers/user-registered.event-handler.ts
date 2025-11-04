import { EventHandler } from '../../../../shared/domain/event-handler';
import { User, UserRegisteredEvent } from '../../domain/entities/user.entity';
import { UserReadRepository } from '../../domain/interfaces/user-read-repository.interface';
import type { Server as WebSocketServer, WebSocket } from 'ws';

export class UserRegisteredEventHandler
  implements EventHandler<UserRegisteredEvent>
{
  constructor(
    private userRepository: UserReadRepository,
    private getWebSocketServer: () => any[]
  ) {}

  async handle(event: UserRegisteredEvent): Promise<void> {
    console.log('UserRegisteredEventHandler received event:', event);
    const user = User.create(
      event.userId,
      event.firstName,
      event.lastName,
      event.userName,
      event.password
    );
    await this.userRepository.save(user);

    // Emitir por WebSocket a todos los clientes conectados
    console.log('Intentando obtener WebSocketServer...');
    const sockets = this.getWebSocketServer();
    console.log('Sockets obtenidos:', sockets.length);
    if (sockets && sockets.length > 0) {
      sockets.forEach((socket: any) => {
        console.log('Enviando mensaje a socket:', socket.readyState);
        if (socket.readyState === socket.OPEN) {
          socket.send('Usuario registrado!');
          socket.send(
            JSON.stringify({
              type: 'user-registered',
              data: {
                userId: event.userId,
                userName: event.userName,
                firstName: event.firstName,
                lastName: event.lastName,
              },
            })
          );
        }
      });
    }
  }
}
