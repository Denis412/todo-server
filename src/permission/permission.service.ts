import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { EntityMetadata, Repository, SelectQueryBuilder } from 'typeorm';
import { generateId, RelationInput } from '../shared';
import { GroupService } from '../group/group.service';
import { UserService } from '../user/user.service';
import { OwnerType } from './types/owner-type.enum';
import { PaginatorWhere } from '../shared/types/dto/paginator-where.type';
import { PaginatorOrderBy } from '../shared/types/dto/paginator-order-by.type';
import getAllWithPagination from '../shared/utils/getAllWithPagination';
import { User } from '../user/entities/user.entity';
import { PaginatorInfo } from '../shared/types/dto/pagination-result.type';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly repository: Repository<Permission>,
    private readonly groupService: GroupService,
    private readonly userService: UserService,
  ) {}

  async create(input: CreatePermissionInput, userInfo: any) {
    const targetOwner =
      input.owner_type === OwnerType.GROUP
        ? await this.groupService.getGroupById(input.owner_id)
        : await this.userService.getUserById(input.owner_id);

    console.log(targetOwner);

    // const input = {
    //   id: generateId(),
    //   ...input,
    //   author_id: userInfo.sub,
    // };
    //
    // if (targetOwner instanceof User)
    //   input.user = {
    //     id: (await this.userService.getUserById(input.owner_id)).id,
    //   };
    // else
    //   input.group = {
    //     id: (await this.groupService.getGroupById(input.owner_id)).id,
    //   };

    return this.repository.save({
      id: generateId(),
      ...input,
      author_id: userInfo.sub,
    });
  }

  findAll(
    info: any,
    page: number,
    perPage: number,
    where?: PaginatorWhere,
    orderBy?: PaginatorOrderBy,
  ) {
    return getAllWithPagination<Permission>(
      info,
      'permissions',
      this.repository,
      page,
      perPage,
      where,
      orderBy,
    );
  }

  checkPermissionInPermissionGuard(where: PaginatorWhere) {
    return getAllWithPagination<Permission>(
      null,
      'permissions',
      this.repository,
      1,
      1000,
      where,
      null,
    );
  }

  getPermissionById(id: string) {
    return this.repository.findOneBy({ id });
  }

  update(id: string, input: UpdatePermissionInput) {
    return this.repository.save({ id, ...input });
  }

  async remove(id: string) {
    const targetPermission = await this.repository.findOneBy({ id });

    if (!targetPermission) {
      throw new NotFoundException(`Not found permission with id ${id}`);
    }

    await this.repository.delete({ id });

    return {
      recordId: id,
    };
  }
}
