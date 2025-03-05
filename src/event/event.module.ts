import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { EventEntity } from '@/event/entity/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity]), UserModule, JwtModule],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
