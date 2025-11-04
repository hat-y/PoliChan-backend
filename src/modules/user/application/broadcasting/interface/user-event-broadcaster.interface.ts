import { UserRegisteredEvent } from '../../../domain/entities/user.entity';

export interface UserEventBroadcaster {
  broadcastUserRegistered(event: UserRegisteredEvent): void;
}
