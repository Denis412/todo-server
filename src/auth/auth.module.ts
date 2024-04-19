import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { PassportStrategy } from '@nestjs/passport';
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';

@Module({
  imports: [UserModule],
  providers: [AuthService, AuthResolver, JwtService, JwtAuthStrategy],
  exports: [JwtService],
})
export class AuthModule {}
