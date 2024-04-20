import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginatorInfo {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  count: number;

  @Field()
  hasMorePages: boolean;

  @Field(() => Int)
  totalPages: number;
  // @Field(() => Int)
  // current: number;
  //
  // @Field(() => Int)
  // currentPage: number;

  @Field(() => Int)
  perPage: number;
}

@ObjectType()
export class PaginationResult {
  @Field(() => [Object])
  data: any[];

  @Field()
  paginatorInfo: PaginatorInfo;
}
