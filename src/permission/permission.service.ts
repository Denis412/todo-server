import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { generateId } from '../shared';
import { GroupService } from '../group/group.service';
import { UserService } from '../user/user.service';
import { OwnerType } from './types/owner-type.enum';
import { PaginatorWhere } from '../shared/types/dto/paginator-where.type';
import { PaginatorOrderBy } from '../shared/types/dto/paginator-order-by.type';
import getAllWithPagination from '../shared/utils/getAllWithPagination';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly repository: Repository<Permission>,
    private readonly groupService: GroupService,
    private readonly userService: UserService,
  ) {}

  async create(input: CreatePermissionInput) {
    const targetOwner =
      input.owner_type === OwnerType.GROUP
        ? await this.groupService.getGroupById(input.owner_id)
        : await this.userService.getUserById(input.owner_id);

    console.log(targetOwner);

    return this.repository.save({
      id: generateId(),
      ...input,
    });
  }

  findAll(
    page: number,
    perPage: number,
    where?: PaginatorWhere,
    orderBy?: PaginatorOrderBy,
  ) {
    return getAllWithPagination<Permission>(
      this.repository,
      page,
      perPage,
      where,
      orderBy,
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
