import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupInput } from './dto/create-group.input';
import { UpdateGroupInput } from './dto/update-group.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { generateId, PaginatorWhereOperator } from '../shared';
import { PaginatorWhere } from '../shared/types/dto/paginator-where.type';
import { PaginatorOrderBy } from '../shared/types/dto/paginator-order-by.type';
import getAllWithPagination from '../shared/utils/getAllWithPagination';
import { User } from '../user/entities/user.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private readonly repository: Repository<Group>,
  ) {}

  async create(input: CreateGroupInput, userInfo: any) {
    return this.repository.save({
      id: generateId(),
      ...input,
      author_id: userInfo.sub,
    });
  }

  async createBaseUsersGroup(user: User) {
    try {
      const usersGroup = await this.getGroupByName('users');

      await this.update(usersGroup.id, {
        users: [...usersGroup.users, user].map((u) => ({ id: u.id })),
      } as UpdateGroupInput);
    } catch (e) {
      await this.create(
        {
          name: 'users',
          label: 'Пользователи',
          users: [{ id: user.id }],
        } as CreateGroupInput,
        {
          sub: user.id,
        },
      );
    }
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

  async getGroupByName(name: string) {
    const targetGroup = await this.repository.findOne({
      where: {
        name,
      },
      relations: {
        users: true,
      },
    });

    if (!targetGroup) {
      throw new NotFoundException(`Not found group with name ${name}`);
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
