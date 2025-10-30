export class User {
  public readonly id: string;
  public email: string;
  public name: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(id: string, email: string, name: string) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public static create(id: string, email: string, name: string): User {
    return new User(id, email, name);
  }

  public updateEmail(email: string): void {
    this.email = email;
    this.updatedAt = new Date();
  }

  public updateName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }

  public toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}