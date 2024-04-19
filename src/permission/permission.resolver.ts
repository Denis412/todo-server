import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PermissionService } from './permission.service';
import { Permission } from './entities/permission.entity';
import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';
import { Public } from '../auth/decorators/public.decorator';

@Public()
@Resolver(() => Permission)
export class PermissionResolver {
  constructor(private readonly permissionService: PermissionService) {}

  @Mutation(() => Permission)
  createPermission(@Args('input') input: CreatePermissionInput) {
    return this.permissionService.create(input);
  }

  @Query(() => [Permission], { name: 'permission' })
  findAll() {
    return this.permissionService.findAll();
  }

  @Query(() => Permission, { name: 'permission' })
  findOne(@Args('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @Mutation(() => Permission)
  updatePermission(
    @Args('id') id: string,
    @Args('input') input: UpdatePermissionInput,
  ) {
    return this.permissionService.update(id, input);
  }

  @Mutation(() => Permission)
  removePermission(@Args('id') id: string) {
    return this.permissionService.remove(id);
  }
}
