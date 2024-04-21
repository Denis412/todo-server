import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  Info,
  Int,
} from '@nestjs/graphql';
import { GroupService } from './group.service';
import { Group } from './entities/group.entity';
import { CreateGroupInput } from './dto/create-group.input';
import { UpdateGroupInput } from './dto/update-group.input';
import { Req } from '@nestjs/common';
import { PaginatorWhere } from '../shared/types/dto/paginator-where.type';
import { PaginatorOrderBy } from '../shared/types/dto/paginator-order-by.type';
// import { Request } from 'express';

@Resolver(() => Group)
export class GroupResolver {
  constructor(private readonly groupService: GroupService) {}

  @Mutation(() => Group, { name: 'CreateGroup' })
  createGroup(
    @Context() context,
    @Args('input')
    input: CreateGroupInput,
  ) {
    return this.groupService.create(input, context.req['user']);
  }

  @Query(() => [Group], { name: 'PaginateGroup' })
  findAll(
    @Info() info,
    @Args('page', { type: () => Int }) page: number,
    @Args('perPage', { type: () => Int }) perPage: number,
    @Args('where', { type: () => PaginatorWhere, nullable: true })
    where?: PaginatorWhere,
    @Args('orderBy', { type: () => PaginatorOrderBy, nullable: true })
    orderBy?: PaginatorOrderBy,
  ) {
    return this.groupService.findAll(info, page, perPage, where, orderBy);
  }

  @Query(() => Group, { name: 'GetGroup' })
  findOne(@Args('id') id: string) {
    return this.groupService.getGroupById(id);
  }

  @Mutation(() => Group, { name: 'UpdateGroup' })
  updateGroup(@Args('id') id: string, @Args('input') input: UpdateGroupInput) {
    return this.groupService.update(id, input);
  }

  @Mutation(() => Group, { name: 'DeleteGroup' })
  removeGroup(@Args('id') id: string) {
    return this.groupService.remove(id);
  }
}
