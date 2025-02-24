import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '@/user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { VkontakteStrategy } from './strategies/vkontakte.strategy';
import { YandexStrategy } from './strategies/yandex.strategy';

@Module({
  imports: [UserModule, ConfigModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, YandexStrategy, VkontakteStrategy],
  exports: [AuthService],
})
export class AuthModule {}
