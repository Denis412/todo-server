import { Field, InputType, Int } from '@nestjs/graphql';
import { PaginatorWhere } from './paginator-where.type';
import { PaginatorOrderBy } from './paginator-order-by.type';

@InputType()
export class Paginator {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  perPage: number;

  @Field(() => PaginatorWhere, { nullable: true })
  where: PaginatorWhere;

  @Field(() => PaginatorOrderBy, { nullable: true })
  orderBy: PaginatorOrderBy;
}
