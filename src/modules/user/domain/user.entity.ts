import { DomainEvent } from '../../../infrastructure/common/event';

// User Entity
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  public static create(id: string, email: string, name: string): User {
    return new User(id, email, name);
  }

  public updateEmail(newEmail: string): User {
    return new User(this.id, newEmail, this.name, this.updatedAt, new Date());
  }

  public updateName(newName: string): User {
    return new User(this.id, this.email, newName, this.updatedAt, new Date());
  }

  public toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

// Domain Event for User Creation
export class UserCreatedEvent extends DomainEvent {
  constructor(
    eventId: string,
    public readonly userId: string,
    public readonly email: string,
    public readonly name: string
  ) {
    super(eventId, userId, 'UserCreated');
  }
}
