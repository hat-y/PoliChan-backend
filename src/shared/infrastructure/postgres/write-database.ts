import { DataSource } from 'typeorm';
import { UserPostgresEntity } from './entities/user-postgres.entity';

export class WriteDatabase {
  private db: DataSource | undefined;
  private initialized: boolean = false;

  constructor() { }

  public async initialize(): Promise<void> {
    if (!this.db) {
      this.db = new DataSource({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        entities: [UserPostgresEntity],
        synchronize: true, // Solo para desarrollo
      });
    }
    if (!this.db.isInitialized) {
      await this.db.initialize();
      this.initialized = true;
    }
  }

  public async close(): Promise<void> {
    if (this.db && this.db.isInitialized) {
      await this.db.destroy();
      this.initialized = false;
    }
  }

  get connection() {
    if (!this.db) throw new Error('Database not initialized');
    return this.db;
  }
}
