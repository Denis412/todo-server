import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Info,
  Context,
} from '@nestjs/graphql';
import { PermissionService } from './permission.service';
import { Permission } from './entities/permission.entity';
import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';
import { DeleteResult } from '../shared';
import { PaginatorWhere } from '../shared/types/dto/paginator-where.type';
import { PaginatorOrderBy } from '../shared/types/dto/paginator-order-by.type';
import { PermissionPaginate } from './entities/permission-paginate.type';

@Resolver(() => Permission)
export class PermissionResolver {
  constructor(private readonly permissionService: PermissionService) {}

  @Mutation(() => Permission, { name: 'CreatePermission' })
  createPermission(
    @Context() context,
    @Args('input') input: CreatePermissionInput,
  ) {
    console.log('cont', context.req['user']);
    return this.permissionService.create(input, context.req['user']);
  }

  @Query(() => PermissionPaginate, {
    name: 'PaginatePermission',
  })
  findAll(
    @Info() info,
    @Args('page', { type: () => Int }) page: number,
    @Args('perPage', { type: () => Int }) perPage: number,
    @Args('where', { type: () => PaginatorWhere, nullable: true })
    where?: PaginatorWhere,
    @Args('orderBy', { type: () => PaginatorOrderBy, nullable: true })
    orderBy?: PaginatorOrderBy,
  ) {
    return this.permissionService.findAll(info, page, perPage, where, orderBy);
  }

  @Query(() => Permission, { name: 'GetPermission' })
  findOne(@Args('id') id: string) {
    return this.permissionService.getPermissionById(id);
  }

  @Mutation(() => Permission, { name: 'UpdatePermission' })
  updatePermission(
    @Args('id') id: string,
    @Args('input') input: UpdatePermissionInput,
  ) {
    return this.permissionService.update(id, input);
  }

  @Mutation(() => DeleteResult, { name: 'DeletePermission' })
  deletePermission(@Args('id') id: string) {
    return this.permissionService.remove(id);
  }
}
