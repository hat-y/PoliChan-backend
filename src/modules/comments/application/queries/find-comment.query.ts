import { Query } from "../../../../shared/domain/query";

export class FindCommentQuery extends Query {
  constructor(
    queryId: string,
    public readonly commentId: string
  ) {
    super(queryId)
  }
}