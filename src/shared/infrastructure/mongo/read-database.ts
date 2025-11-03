import { DataSource } from 'typeorm';
import { UserMongoEntity } from './entities/user-mongo.entity';

export class ReadDatabase {
  private db: DataSource;
  private initialized: boolean = false;

  constructor() {}

  public async initialize(): Promise<void> {
    if (!this.db?.isInitialized) {
      this.db = new DataSource({
        type: 'mongodb',
        host: process.env.MONGODB_HOST || 'localhost',
        port: Number(process.env.MONGODB_PORT) || 27017,
        database: process.env.MONGODB_DB || 'polichan',
        username: process.env.MONGO_INITDB_ROOT_USERNAME || 'root',
        password: process.env.MONGO_INITDB_ROOT_PASSWORD || 'root',
        entities: [UserMongoEntity],
        synchronize: true, // Solo para desarrollo
      });
      await this.db.initialize();
      this.initialized = true;
    }
  }

  public async close(): Promise<void> {
    if (this.db?.isInitialized) {
      await this.db.destroy();
      this.initialized = false;
    }
  }

  get connection() {
    return this.db;
  }
}
