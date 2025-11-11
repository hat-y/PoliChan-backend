import { DataSource } from 'typeorm';
import { UserMongoEntity } from './entities/user-mongo.entity';
import { PostMongoEntity } from './entities/post-mongo.entity';
import { CommentMongoEntity } from './entities/comment-mongo.entity';
import { PostMentionMongoEntity } from './entities/post-mention-mongo.entity';

export class ReadDatabase {
  private db: DataSource | undefined;
  private initialized: boolean = false;

  constructor() {}

  public async initialize(): Promise<void> {
    if (!this.db) {
      this.db = new DataSource({
        type: 'mongodb',
        url: process.env.MONGODB_URI,
        entities: [
          UserMongoEntity,
          PostMongoEntity,
          CommentMongoEntity,
          PostMentionMongoEntity,
        ],
        synchronize: true, // Solo para desarrollo
        logging: false,
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
