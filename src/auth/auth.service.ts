import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';
import { SignUpResponse } from './dto/sign-up.response';
import { SignInResponse } from './dto/sign-in.response';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as argon from 'argon2';
import jwtConstants from './constants/jwtConstants';
import { GroupService } from '../group/group.service';
import { CreateGroupInput } from '../group/dto/create-group.input';
import { UpdateGroupInput } from '../group/dto/update-group.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly groupService: GroupService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async signUp(input: SignUpInput): Promise<SignUpResponse> {
    const user = await this.userService.getUserByEmail(input.email);

    if (user) {
      throw new UnauthorizedException(
        'Пользователь с таким email уже существует!',
      );
    }

    const hashedPassword = await argon.hash(input.password);

    const createdUser = await this.userService.create({
      email: input.email,
      username: input.username,
      password: hashedPassword,
    });

    try {
      const usersGroup = await this.groupService.getGroupByName('users');

      await this.groupService.update(usersGroup.id, {
        users: [...usersGroup.users, createdUser].map((u) => ({ id: u.id })),
      } as UpdateGroupInput);
    } catch (e) {
      console.log('e', e);
      await this.groupService.create(
        {
          name: 'users',
          label: 'Пользователи',
          users: [{ id: createdUser.id }],
        } as CreateGroupInput,
        {
          sub: createdUser.id,
        },
      );
    }

    return {
      id: createdUser.id,
      email: createdUser.email,
      username: createdUser.username,
    };
  }
  async signIn(input: SignInInput): Promise<SignInResponse> {
    const user = await this.userService.getUserByEmail(input.login);

    if (!user) {
      throw new UnauthorizedException(
        'Пользователя с таким email не существует!',
      );
    }

    const isMatchPasswords = await argon.verify(user.password, input.password);

    if (!isMatchPasswords) {
      throw new UnauthorizedException('Введен неверный парроль');
    }

    const tokens = await this.createTokens(user.id, user.email);

    return {
      user_id: user.id,
      ...tokens,
      type: 'Bearer',
    };
  }

  async createTokens(userId: string, email: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId, email },
      {
        expiresIn: '15m',
        secret: jwtConstants.secret,
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId, email },
      {
        expiresIn: '7d',
        secret: jwtConstants.refreshSecret,
      },
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new UnauthorizedException(
        'Пользователя с таким email не существует!',
      );
    }

    console.log(refreshToken);
  }
}
