import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import {
  TOKEN_EXPIRATION_ACCESS,
  TOKEN_EXPIRATION_REFRESH,
} from '@/constants/token.contant';
import { UserEntity } from '@/user/entity/user.entity';
import { UserService } from '@/user/user.service';

import { ISocialProfile } from './types/auth.type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async loginSocial(dto: ISocialProfile) {
    const loginDto = {
      username:
        `${dto.firstName}${dto.lastName ? ' ' : ''}${dto.lastName}`.trim(),
      email: dto.email,
      picture: dto?.picture,
    };

    const candidate = await this.userService.findOneBy({
      email: dto.email,
    });

    if (!candidate) {
      return await this.userService.create(loginDto);
    }

    return candidate;
  }

  async generateTokens(payload: Pick<UserEntity, 'id' | 'username'>) {
    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        { id: payload.id, username: payload.username },
        {
          expiresIn: TOKEN_EXPIRATION_ACCESS,
          privateKey: this.configService.get<string>('JWT_SECRET_KEY'),
        },
      ),
      await this.jwtService.signAsync(
        { id: payload.id, username: payload.username },
        {
          expiresIn: TOKEN_EXPIRATION_REFRESH,
          privateKey: this.configService.get<string>('JWT_SECRET_KEY'),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async attachTokensToResponse(
    user: Pick<UserEntity, 'id' | 'username'>,
    res: Response,
  ) {
    const { accessToken, refreshToken } = await this.generateTokens(user);

    const accessDay = parseInt(TOKEN_EXPIRATION_ACCESS) * 24 * 60 * 60 * 1000;
    const refreshDay = parseInt(TOKEN_EXPIRATION_REFRESH) * 24 * 60 * 60 * 1000;

    const accessExpiresIn = new Date(Date.now() + accessDay);
    const refreshExpiresIn = new Date(Date.now() + refreshDay);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      expires: accessExpiresIn,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: refreshExpiresIn,
    });
  }
}
