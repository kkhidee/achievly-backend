import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

import {
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND,
} from '@/constants/error.constant';
import { GoalEntity } from '@/goal/entity/goal.entity';

import { UserEntity } from './entity/user.entity';
import { EventEntity } from '@/event/entity/event.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(userEntity: Partial<UserEntity>): Promise<UserEntity> {
    const candidate = await this.userRepository.findOneBy({
      email: userEntity.email,
    });

    if (candidate) {
      throw new BadRequestException(USER_ALREADY_EXISTS);
    }

    return await this.userRepository.save(userEntity);
  }

  async deleteById(id: string) {
    await this.userRepository.delete(id);
  }

  async updateById(id: string, userEntity: Partial<UserEntity>) {
    await this.userRepository.update(id, userEntity);
  }

  async find(options?: FindManyOptions<UserEntity>): Promise<UserEntity[]> {
    return await this.userRepository.find(options);
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    return user;
  }

  async findOneBy(
    options: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
  ): Promise<UserEntity> {
    return await this.userRepository.findOneBy(options);
  }

  async getGoals(options: { userId: number }): Promise<GoalEntity[]> {
    const result = await this.userRepository.findOne({
      where: { id: options.userId },
      relations: {
        goals: true,
      },
    });

    return result?.goals || [];
  }

  async getEvents(options: { userId: number }): Promise<EventEntity[]> {
    const result = await this.userRepository.findOne({
      where: { id: options.userId },
      relations: {
        events: true,
      },
    });

    return result?.events || [];
  }
}
