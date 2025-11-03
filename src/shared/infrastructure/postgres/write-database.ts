import { DataSource } from 'typeorm';
import { UserPostgresEntity } from './entities/user-postgres.entity';

export class WriteDatabase {
  private db: DataSource;
  private initialized: boolean = false;

  constructor() {}

  public async initilialize(): Promise<void> {
    if (!this.db.isInitialized) {
      this.db = new DataSource({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: Number(process.env.POSTGRES_PORT) || 5432,
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        database: process.env.POSTGRES_DB || 'polichan',
        entities: [UserPostgresEntity],
        synchronize: true, // Solo para desarrollo
      });
      this.initialized = true;
    }
  }

  public async close(): Promise<void> {
    if (this.db.isInitialized) {
      await this.db.destroy();
      this.initialized = false;
    }
  }

  get connection() {
    return this.db;
  }
}
