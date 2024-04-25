import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { generateId } from '../shared';
import { PaginatorWhere } from '../shared/types/dto/paginator-where.type';
import { PaginatorOrderBy } from '../shared/types/dto/paginator-order-by.type';
import getAllWithPagination from '../shared/utils/getAllWithPagination';
import { Permission } from '../permission/entities/permission.entity';

@Injectable()
export class UserService {
  relations = ['permissions'];
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  create(input: CreateUserInput) {
    return this.repository.save({ id: generateId(), ...input });
  }

  update(id: string, input: UpdateUserInput) {
    return this.repository.save({ id, ...input });
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  findAll(
    info: any,
    page: number,
    perPage: number,
    where?: PaginatorWhere,
    orderBy?: PaginatorOrderBy,
    objectPermissions?: Permission[],
  ) {
    return getAllWithPagination<User>(
      info,
      'users',
      this.repository,
      page,
      perPage,
      where,
      orderBy,
      objectPermissions,
    );
  }

  getUserByEmail(email: string) {
    return this.repository.findOne({
      where: { email },
      relations: this.relations,
    });
  }

  async getUserById(id: string) {
    const targetUser = await this.repository.findOne({
      where: { id },
      relations: this.relations,
    });

    if (!targetUser) {
      throw new NotFoundException(`Not found user with id ${id}`);
    }

    return targetUser;
  }
}
