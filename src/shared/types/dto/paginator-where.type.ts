import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

export enum PaginatorWhereOperator {
  EQ,
  NEQ,
  FTS,
}

registerEnumType(PaginatorWhereOperator, {
  name: 'PaginatorWhereOperator',
});

@InputType()
export class PaginatorWhere {
  // @IsString()
  @Field({ nullable: true })
  column?: string;

  @Field(() => PaginatorWhereOperator, { nullable: true })
  operator?: PaginatorWhereOperator;

  @Field({ nullable: true })
  value?: string;

  @Field(() => [PaginatorWhere], { nullable: true })
  and?: PaginatorWhere[];

  @Field(() => [PaginatorWhere], { nullable: true })
  or?: PaginatorWhere[];
}
