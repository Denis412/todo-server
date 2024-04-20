import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { EntityMetadata, Repository, SelectQueryBuilder } from 'typeorm';
import { generateId } from '../shared';
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

  async create(input: CreatePermissionInput) {
    const targetOwner =
      input.owner_type === OwnerType.GROUP
        ? await this.groupService.getGroupById(input.owner_id)
        : await this.userService.getUserById(input.owner_id);

    console.log(targetOwner);

    return this.repository.save({
      id: generateId(),
      ...input,
      user: targetOwner as User,
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

  addRelationWithInfo(
    fieldNodes: any[],
    qb: SelectQueryBuilder<Permission>,
    metadata: EntityMetadata,
    alias: string,
  ) {
    for (const field of fieldNodes) {
      if (!field.selectionSet) continue;

      const relation = metadata.relations.find(
        (rel) => rel.propertyName === field.name.value,
      );

      if (!relation) continue;

      const propertyName = `${alias}.${relation.propertyName}`;
      const relationAlias = `${alias}-${relation.propertyName}`;

      console.log(propertyName, relationAlias);

      qb.leftJoinAndSelect(propertyName, relationAlias);
      this.addRelationWithInfo(
        field.selectionSet.selections,
        qb,
        relation.inverseEntityMetadata,
        relationAlias,
      );
    }
  }

  addRelation(
    qb: SelectQueryBuilder<Permission>,
    metadata: EntityMetadata,
    propName: string,
    alias: string,
  ) {}
  addRelations(
    qb: SelectQueryBuilder<Permission>,
    metadata: EntityMetadata,
    alias: string,
    currentDepth: number = 1,
  ) {
    if (currentDepth > 4) return;

    metadata.relations.forEach((relation) => {
      const propertyName = `${alias}.${relation.propertyName}`;
      const relationAlias = `${alias}-${relation.propertyName}`;

      console.log(propertyName, relationAlias);

      qb.leftJoinAndSelect(propertyName, relationAlias);

      this.addRelations(
        qb,
        relation.inverseEntityMetadata,
        relationAlias,
        currentDepth + 1,
      );
    });
  }

  async findAll1(
    info: any,
    page: number,
    perPage: number,
    where?: PaginatorWhere,
    orderBy?: PaginatorOrderBy,
  ) {
    const qb = this.repository.createQueryBuilder('permissions');

    const permissionMetadata = this.repository.metadata;

    // this.addRelations(qb, permissionMetadata, 'permissions');
    const fieldNodes =
      info.fieldNodes[0].selectionSet.selections[0].selectionSet.selections;
    this.addRelationWithInfo(fieldNodes, qb, permissionMetadata, 'permissions');

    if (where) {
    }

    const [data, totalElements] = await qb
      .offset(0)
      .limit(50)
      .getManyAndCount();

    const totalPages = Math.ceil(totalElements / perPage);

    const paginationMeta: PaginatorInfo = {
      page,
      perPage,
      count: totalElements,
      hasMorePages: totalPages > page,
      totalPages: totalPages,
    };

    return { data, paginatorInfo: paginationMeta };
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
