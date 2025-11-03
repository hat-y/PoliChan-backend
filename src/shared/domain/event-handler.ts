import { DomainEvent } from './event';

export interface EventHandler<TEvent extends DomainEvent> {
  handle(event: TEvent): Promise<void>;
}
