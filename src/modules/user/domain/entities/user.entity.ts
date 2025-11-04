import { DomainEvent } from '../../../../shared/domain/event';

// User Entity
export class User {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly userName: string,
    public readonly password: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  public static create(
    id: string,
    firstName: string,
    lastName: string,
    userName: string,
    password: string
  ): User {
    return new User(id, firstName, lastName, userName, password);
  }

  public updateEmail(newEmail: string): User {
    return new User(
      this.id,
      this.firstName,
      this.lastName,
      newEmail,
      this.password,
      this.createdAt,
      new Date()
    );
  }

  public updateName(newName: string): User {
    return new User(
      this.id,
      newName,
      this.lastName,
      this.userName,
      this.password,
      this.createdAt,
      new Date()
    );
  }

  public toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      userName: this.userName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

// Domain Event for User Creation
export class UserRegisteredEvent extends DomainEvent {
  constructor(
    eventId: string,
    public readonly userId: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly userName: string,
    public readonly password: string
  ) {
    super(eventId, userId, 'UserCreated');
  }
}

// Domain Event for User Update
export class UserUpdatedEvent extends DomainEvent {
  constructor(
    eventId: string,
    public readonly userId: string,
    public readonly userName: string
  ) {
    super(eventId, userId, 'UserUpdated');
  }
}
