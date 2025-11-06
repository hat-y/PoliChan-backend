import { Query } from "../../../../shared/domain/query";

export class FindCommentsByPostQuery extends Query {
  constructor(
    queryId: string,
    public readonly postId: string,
    public readonly limit: number = 50,
    public readonly offset: number = 0
  ) {
    super(queryId)
  }
}