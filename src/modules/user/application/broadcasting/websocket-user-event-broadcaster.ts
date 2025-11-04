import { UserRegisteredEvent } from '../../domain/entities/user.entity';
import { UserEventBroadcaster } from './interface/user-event-broadcaster.interface';

export class WebSocketUserEventBroadcaster implements UserEventBroadcaster {
  constructor(private getWebSocketServer: () => any[]) {}

  broadcastUserRegistered(event: UserRegisteredEvent): void {
    const sockets = this.getWebSocketServer();
    if (sockets && sockets.length > 0) {
      sockets.forEach((socket: any) => {
        if (socket.readyState === socket.OPEN) {
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
