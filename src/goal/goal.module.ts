import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GoalEntity } from '@/goal/entity/goal.entity';
import { UserModule } from '@/user/user.module';

import { GoalController } from './goal.controller';
import { GoalService } from './goal.service';

@Module({
  imports: [TypeOrmModule.forFeature([GoalEntity]), UserModule, JwtModule],
  providers: [GoalService],
  controllers: [GoalController],
})
export class GoalModule {}
