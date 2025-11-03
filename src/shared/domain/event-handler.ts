import { DomainEvent } from './event';

export interface EventHandler<TEvent extends DomainEvent> {
  handler(event: TEvent): Promise<void>;
}
