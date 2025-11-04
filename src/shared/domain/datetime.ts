export class CreatedAt {
  public readonly value: Date;

  constructor(date?: Date) {
    this.value = date ?? new Date();
  }

  public static now(): CreatedAt {
    return new CreatedAt(new Date());
  }

  public static from(date: Date): CreatedAt {
    return new CreatedAt(date);
  }

  public toDate(): Date {
    return this.value;
  }

  public toString(): string {
    return this.value.toISOString();
  }
}

export class UpdatedAt {
  public readonly value: Date;

  constructor(date?: Date) {
    this.value = date ?? new Date();
  }

  public static now(): UpdatedAt {
    return new UpdatedAt(new Date());
  }

  public static from(date: Date): UpdatedAt {
    return new UpdatedAt(date);
  }

  public toDate(): Date {
    return this.value;
  }

  public toString(): string {
    return this.value.toISOString();
  }
}

export class DeletedAt {
  public readonly value: Date;

  constructor(date: Date) {
    this.value = date;
  }

  public static now(): DeletedAt {
    return new DeletedAt(new Date());
  }

  public static from(date: Date): DeletedAt {
    return new DeletedAt(date);
  }

  public toDate(): Date {
    return this.value;
  }

  public toString(): string {
    return this.value.toISOString();
  }
}

export class Timestamps {
  constructor(
    public readonly createdAt: CreatedAt,
    public readonly updatedAt: UpdatedAt,
    public readonly deletedAt?: DeletedAt
  ) { }

  public static create(): Timestamps {
    const now = CreatedAt.now();
    return new Timestamps(now, UpdatedAt.from(now.toDate()));
  }

  public static from(createdAt: Date, updatedAt: Date, deletedAt?: Date): Timestamps {
    return new Timestamps(
      CreatedAt.from(createdAt),
      UpdatedAt.from(updatedAt),
      deletedAt ? DeletedAt.from(deletedAt) : undefined
    );
  }

  public update(): Timestamps {
    return new Timestamps(
      this.createdAt,
      UpdatedAt.now(),
      this.deletedAt
    );
  }

  public delete(): Timestamps {
    return new Timestamps(
      this.createdAt,
      this.updatedAt,
      DeletedAt.now()
    );
  }

  public isDeleted(): boolean {
    return !!this.deletedAt;
  }
}

export type DateTime = CreatedAt | UpdatedAt | DeletedAt;
