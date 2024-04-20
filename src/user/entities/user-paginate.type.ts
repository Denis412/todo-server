import { Field, ObjectType } from '@nestjs/graphql';
import { PaginatorInfo } from '../../shared/types/dto/pagination-result.type';
import { User } from './user.entity';

@ObjectType()
export class UserPaginate {
  @Field(() => [User])
  data: User[];

  @Field(() => PaginatorInfo)
  paginatorInfo: PaginatorInfo;
}
