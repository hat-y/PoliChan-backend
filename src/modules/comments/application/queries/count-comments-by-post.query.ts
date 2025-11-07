import { Query } from "../../../../shared/domain/query";

export class CountCommentsByPostQuery extends Query {
  constructor(
    queryId: string,
    public readonly postId: string
  ) {
    super(queryId)
  }
}