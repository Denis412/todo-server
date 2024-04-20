import { Permission } from './permission.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaginatorInfo } from '../../shared/types/dto/pagination-result.type';

@ObjectType()
export class PermissionPaginate {
  @Field(() => [Permission])
  data: Permission[];

  @Field(() => PaginatorInfo)
  paginatorInfo: PaginatorInfo;
}
