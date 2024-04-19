import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionResolver } from './permission.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { UserModule } from '../user/user.module';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), UserModule, GroupModule],
  providers: [PermissionResolver, PermissionService],
})
export class PermissionModule {}
