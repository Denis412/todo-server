import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

export enum PaginatorOrderByOrder {
  DESC,
  ASC,
}

registerEnumType(PaginatorOrderByOrder, {
  name: 'PaginatorOrderByOrder',
});

@InputType()
export class PaginatorOrderBy {
  // @IsString()
  @Field()
  column: string;

  @Field(() => PaginatorOrderByOrder)
  order: PaginatorOrderByOrder;
}
