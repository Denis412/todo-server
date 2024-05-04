import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';
import { GroupModule } from '../group/group.module';

@Module({
  imports: [UserModule, GroupModule],
  providers: [AuthService, AuthResolver, JwtService, JwtAuthStrategy],
  exports: [JwtService],
})
export class AuthModule {}
