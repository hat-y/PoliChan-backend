export abstract class DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date;
  public readonly aggregateId: string;
  public readonly eventType: string;

  constructor(eventId: string, aggregateId: string, eventType: string) {
    this.eventId = eventId;
    this.occurredAt = new Date();
    this.aggregateId = aggregateId;
    this.eventType = eventType;
  }
}
