import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupInput } from './dto/create-group.input';
import { UpdateGroupInput } from './dto/update-group.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private readonly repository: Repository<Group>,
  ) {}

  create(input: CreateGroupInput) {
    return 'This action adds a new group';
  }

  findAll() {
    return `This action returns all group`;
  }

  async getGroupById(id: string) {
    const targetGroup = await this.repository.findOneBy({ id });

    if (!targetGroup) {
      throw new NotFoundException(`Not found group with id ${id}`);
    }

    return targetGroup;
  }

  update(id: number, input: UpdateGroupInput) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
