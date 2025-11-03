import { Query } from './query';

export interface QueryHandler<TQuery extends Query, TResult> {
  handler(query: TQuery): Promise<TResult>;
}
