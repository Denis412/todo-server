import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PermissionService } from '../permission.service';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { PaginatorWhereOperator } from '../../shared';
import { ModelType } from '../types/model-type.enum';
import { GroupService } from '../../group/group.service';
import { ForbiddenError } from '@nestjs/apollo';
import { PaginatorWhere } from '../../shared/types/dto/paginator-where.type';

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

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const authorizationHeader = request.headers.authorization?.split(' ')[1];

    if (!isPublic && !authorizationHeader) {
      throw new ForbiddenException();
    }

    if (isPublic) return true;

    const res = this.jwtService.decode(authorizationHeader);

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

    const _whereCurrentUser: PaginatorWhere = {
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
    };

    const isAdmin = !!userGroups.data.find(
      (g) => g.name.toLowerCase() === 'admins',
    );

    const getPermissionsFilter = (modelType: string, modelName: string) => {
      return [
        {
          column: 'model_type',
          operator: PaginatorWhereOperator.EQ,
          value: modelType,
        },
        {
          column: 'model_name',
          operator: PaginatorWhereOperator.EQ,
          value: modelName,
        },
      ];
    };

    const getObjectPermissions = () => {
      return this.permissionService.checkPermissionInPermissionGuard({
        and: [...getPermissionsFilter('object', entity), _whereCurrentUser],
      });
    };

    const checkAllPermissionsLevel = async (
      level: number,
      errorText: string = 'Объект не найден',
    ) => {
      permissions = [...permissions, ...(await getObjectPermissions()).data];

      if (!permissions.some((p) => p.level >= level)) {
        throw new NotFoundException(errorText);
      }

      return true;
    };

    const typePermissions =
      await this.permissionService.checkPermissionInPermissionGuard({
        and: [
          ...getPermissionsFilter(ModelType.TYPE, entity),
          _whereCurrentUser,
        ],
      });

    let permissions = [...typePermissions.data];

    if (operation === 'paginate') {
      if (
        !isAdmin &&
        !permissions.some((permission) => permission.level >= 4)
      ) {
        throw new ForbiddenError('Нет доступа');
      }
      request['object-permissions'] = (await getObjectPermissions()).data;
    } else if (operation === 'create') {
      if (
        !isAdmin &&
        !permissions.some(
          (permission) =>
            permission.level >= 7 ||
            permission.config?.personal_access_level >= 4,
        )
      ) {
        throw new ForbiddenError('Нет доступа');
      }
    } else if (operation === 'get') {
      if (!isAdmin) await checkAllPermissionsLevel(4);
    } else if (operation === 'update') {
      if (!isAdmin) await checkAllPermissionsLevel(5);
    } else if (operation === 'delete') {
      if (!isAdmin) await checkAllPermissionsLevel(7);
    }

    request['user'] = res;
    return true;
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req;
  }
}
