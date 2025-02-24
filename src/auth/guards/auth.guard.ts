import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { ICookies } from '@/auth/types/auth.type';
import { WRONG_TOKEN } from '@/constants/error.constant';
import { TOKEN_EXPIRATION_ACCESS } from '@/constants/token.contant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse() as Response;

    const cookies: ICookies = request.cookies;

    const { accessToken, refreshToken } = cookies;

    if (!accessToken && refreshToken) {
      try {
        const user = await this.jwtService.verifyAsync(refreshToken, {
          secret: this.configService.get('JWT_SECRET_KEY'),
        });

        if (user) {
          const accessToken = await this.jwtService.signAsync(
            { id: user.id, username: user.username },
            {
              expiresIn: TOKEN_EXPIRATION_ACCESS,
              privateKey: this.configService.get<string>('JWT_SECRET_KEY'),
            },
          );

          const accessDay =
            parseInt(TOKEN_EXPIRATION_ACCESS) * 24 * 60 * 60 * 1000;

          const accessExpiresIn = new Date(Date.now() + accessDay);

          response.cookie('accessToken', accessToken, {
            httpOnly: true,
            expires: accessExpiresIn,
          });

          return;
        }
      } catch {
        throw new UnauthorizedException(WRONG_TOKEN);
      }

      return true;
    }

    try {
      request['user'] = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get('JWT_SECRET_KEY'),
      });
    } catch {
      throw new UnauthorizedException(WRONG_TOKEN);
    }

    return true;
  }
}
