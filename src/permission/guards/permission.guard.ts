import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PermissionService } from '../permission.service';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    // const authorizationHeader = request.headers.authorization?.split(' ')[1];

    // const res = this.jwtService.decode(authorizationHeader);
    // const userId = res.sub;

    // console.log('req', request, authorizationHeader, res, userId);

    return true;
  }
}
