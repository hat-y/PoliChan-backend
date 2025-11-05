import { DataSource } from 'typeorm';
import { UserMongoEntity } from './entities/user-mongo.entity';
import { PostMongoEntity } from './entities/post-mongo.entity';

export class ReadDatabase {
  private db: DataSource | undefined;
  private initialized: boolean = false;

  constructor() {}

  public async initialize(): Promise<void> {
    if (!this.db) {
      this.db = new DataSource({
        type: 'mongodb',
        url: process.env.MONGODB_URI,
        entities: [UserMongoEntity, PostMongoEntity],
        synchronize: true, // Solo para desarrollo
        logging: true,
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
