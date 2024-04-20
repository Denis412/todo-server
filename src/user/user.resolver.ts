import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Public } from '../auth/decorators/public.decorator';

@Public()
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('input') input: CreateUserInput) {
    return this.userService.create(input);
  }

  @Mutation(() => User)
  updateUser(@Args('id') id: string, @Args('input') input: UpdateUserInput) {
    return this.userService.update(id, input);
  }

  @Mutation(() => User)
  removeUser(@Args('id') id: string) {
    return this.userService.remove(id);
  }

  @Query(() => [User], { name: 'user' })
  paginateUser() {
    return this.userService.paginateUser();
  }

  @Query(() => User, { name: 'user' })
  getUser(@Args('id') id: string) {
    return this.userService.getUserById(id);
  }
}
