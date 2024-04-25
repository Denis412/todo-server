import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PermissionService } from '../permission.service';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { PaginatorWhereOperator } from '../../shared';
import { ModelType } from '../types/model-type.enum';
import { GroupService } from '../../group/group.service';
import { ForbiddenError } from '@nestjs/apollo';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly permissionService: PermissionService,
    private readonly groupService: GroupService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    //
    if (isPublic) return true;

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const authorizationHeader = request.headers.authorization?.split(' ')[1];

    const res = this.jwtService.decode(authorizationHeader);
    const userId = res.sub;

    const graphQlInfo = ctx.getInfo();
    const pathKey = graphQlInfo.path.key;

    const [operation, entity] = pathKey
      .split(/(?=[A-Z])/)
      .map((word) => word.toLowerCase());

    const userGroups = await this.groupService.findAll(null, 1, 1000, {
      column: 'users->id',
      operator: PaginatorWhereOperator.EQ,
      value: res.sub,
    });

    const typePermissions =
      await this.permissionService.checkPermissionInPermissionGuard({
        and: [
          {
            column: 'model_type',
            operator: PaginatorWhereOperator.EQ,
            value: ModelType.TYPE,
          },
          {
            column: 'model_name',
            operator: PaginatorWhereOperator.EQ,
            value: entity,
          },
          {
            or: [
              {
                column: 'owner_id',
                operator: PaginatorWhereOperator.EQ,
                value: res.sub,
              },
              ...userGroups.data.map(({ id }) => ({
                column: 'owner_id',
                operator: PaginatorWhereOperator.EQ,
                value: id,
              })),
            ],
          },
        ],
      });

    const permissions = [...typePermissions.data];

    if (operation === 'paginate') {
      if (!permissions.some((permission) => permission.level >= 4)) {
        throw new ForbiddenError('Нет доступа');
      }

      const objectsPermissions =
        await this.permissionService.checkPermissionInPermissionGuard({
          and: [
            {
              column: 'model_name',
              operator: PaginatorWhereOperator.EQ,
              value: entity,
            },
            {
              column: 'model_type',
              operator: PaginatorWhereOperator.EQ,
              value: 'object',
            },
          ],
        });

      request['object-permissions'] = objectsPermissions.data;
    }
    // else if (operation === 'get') {
    //   if (!permissions.some((permission) => permission.level >= 4)) {
    //     throw new ForbiddenError('Нет доступа');
    //   }
    // } else if (operation === 'update') {
    //   if (!permissions.some((permission) => permission.level >= 5)) {
    //     throw new ForbiddenError('Нет доступа');
    //   }
    // } else if (operation === 'create') {
    //   if (!permissions.some((permission) => permission.level >= 7)) {
    //     throw new ForbiddenError('Нет доступа');
    //   }
    // } else if (operation === 'delete') {
    //   if (!permissions.some((permission) => permission.level >= 7)) {
    //     throw new ForbiddenError('Нет доступа');
    //   }
    // }

    return true;
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req;
  }
}
