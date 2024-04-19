import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionInput } from './dto/create-permission.input';
import { UpdatePermissionInput } from './dto/update-permission.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { generateId } from '../shared';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly repository: Repository<Permission>,
  ) {}

  async create(input: CreatePermissionInput) {
    return this.repository.save({
      id: generateId(),
      ...input,
    });
  }

  findAll() {
    return `This action returns all permission`;
  }

  findOne(id: string) {
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
