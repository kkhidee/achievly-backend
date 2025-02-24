import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Callback, Strategy } from 'passport-yandex';

import { AuthService } from '@/auth/auth.service';
import { ISocialProfile } from '@/auth/types/auth.type';

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get('YANDEX_CLIENT_ID'),
      clientSecret: configService.get('YANDEX_CLIENT_SECRET'),
      callbackURL: configService.get('YANDEX_CALLBACK_URL'),
    });
  }

  validate: Callback<ISocialProfile> = async (
    accessToken,
    refreshToken,
    profile,
    done,
  ) => {
    const { name, emails, photos } = profile;

    const user: ISocialProfile = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };

    done(null, user);
  };
}
