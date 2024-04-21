import { Resolver, Query, Mutation, Args, Int, Info } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Public } from '../auth/decorators/public.decorator';
import { PaginatorWhere } from '../shared/types/dto/paginator-where.type';
import { PaginatorOrderBy } from '../shared/types/dto/paginator-order-by.type';
import { UserPaginate } from './entities/user-paginate.type';

// @Public()
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('input') input: CreateUserInput) {
    return this.userService.create(input);
  }

  @Mutation(() => User, { name: 'UpdateUser' })
  updateUser(@Args('id') id: string, @Args('input') input: UpdateUserInput) {
    return this.userService.update(id, input);
  }

  @Mutation(() => User, { name: 'DeleteUser' })
  removeUser(@Args('id') id: string) {
    return this.userService.remove(id);
  }

  @Query(() => UserPaginate, { name: 'PaginateUser' })
  paginateUser(
    @Info() info,
    @Args('page', { type: () => Int }) page: number,
    @Args('perPage', { type: () => Int }) perPage: number,
    @Args('where', { type: () => PaginatorWhere, nullable: true })
    where?: PaginatorWhere,
    @Args('orderBy', { type: () => PaginatorOrderBy, nullable: true })
    orderBy?: PaginatorOrderBy,
  ) {
    return this.userService.findAll(info, page, perPage, where, orderBy);
  }

  @Query(() => User, { name: 'GetUser' })
  getUser(@Args('id') id: string) {
    return this.userService.getUserById(id);
  }
}
