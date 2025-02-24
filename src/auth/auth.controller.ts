import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from '@/auth/auth.service';
import { ISocialProfile } from '@/auth/types/auth.type';

@ApiExcludeController()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: { user: ISocialProfile },
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.loginSocial(req.user);

    await this.authService.attachTokensToResponse(user, response);

    response.redirect(this.configService.get('CLIENT_URL'));
  }

  @Get('/yandex')
  @UseGuards(AuthGuard('yandex'))
  async yandexAuth() {}

  @Get('/yandex/redirect')
  @UseGuards(AuthGuard('yandex'))
  async yandexAuthRedirect(
    @Req() req: { user: ISocialProfile },
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.loginSocial(req.user);

    await this.authService.attachTokensToResponse(user, response);

    response.redirect(this.configService.get('CLIENT_URL'));
  }

  @Get('/vkontakte')
  @UseGuards(AuthGuard('vkontakte'))
  async vkontakteAuth() {}

  @Get('/vkontakte/redirect')
  @UseGuards(AuthGuard('vkontakte'))
  async vkontakteAuthRedirect(
    @Req() req: { user: ISocialProfile },
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.loginSocial(req.user);

    await this.authService.attachTokensToResponse(user, response);

    response.redirect(this.configService.get('CLIENT_URL'));
  }
}
