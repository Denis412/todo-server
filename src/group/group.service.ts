import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupInput } from './dto/create-group.input';
import { UpdateGroupInput } from './dto/update-group.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { generateId } from '../shared';
import { PaginatorWhere } from '../shared/types/dto/paginator-where.type';
import { PaginatorOrderBy } from '../shared/types/dto/paginator-order-by.type';
import getAllWithPagination from '../shared/utils/getAllWithPagination';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private readonly repository: Repository<Group>,
  ) {}

  create(input: CreateGroupInput, userInfo: any) {
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
    return getAllWithPagination<Group>(
      info,
      'groups',
      this.repository,
      page,
      perPage,
      where,
      orderBy,
    );
  }

  async getGroupById(id: string) {
    const targetGroup = await this.repository.findOneBy({ id });

    if (!targetGroup) {
      throw new NotFoundException(`Not found group with id ${id}`);
    }

    return targetGroup;
  }

  update(id: string, input: UpdateGroupInput) {
    return this.repository.save({ id, ...input });
  }

  remove(id: string) {
    return `This action removes a #${id} group`;
  }
}
