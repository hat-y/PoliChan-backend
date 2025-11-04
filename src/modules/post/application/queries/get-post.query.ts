import { Query } from "../../../../shared/domain/query";

export class GetAllPost extends Query {
  constructor(
    queryId: string,
    public readonly limit: number,
    public readonly offset: number
  ) {
    super(queryId)
  }
}
