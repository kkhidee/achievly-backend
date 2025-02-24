import { ApiProperty } from '@nestjs/swagger';

import {
  GoalCategoryEnum,
  GoalStatusEnum,
  GoalTypeEnum,
} from '@/constants/goal.constant';
import { HabitEntity } from '@/goal/entity/habit.entity';
import { HistoryEntity } from '@/goal/entity/history.entity';
import { TaskEntity } from '@/goal/entity/task.entity';

export const GoalId = (): PropertyDecorator =>
  ApiProperty({
    description: 'Goal ID',
    type: Number,
    required: true,
  });

export const GoalType = (): PropertyDecorator =>
  ApiProperty({
    description: 'Тип цели',
    enum: GoalTypeEnum,
    required: true,
  });

export const GoalTitle = (): PropertyDecorator =>
  ApiProperty({
    description: 'Наименование цели',
    type: String,
    required: true,
  });

export const GoalStatus = (): PropertyDecorator =>
  ApiProperty({
    description: 'Статус цели',
    enum: GoalStatusEnum,
    required: true,
  });

export const GoalNote = (): PropertyDecorator =>
  ApiProperty({
    description: 'Примечание к цели',
    type: String,
    required: false,
    nullable: true,
  });

export const GoalCategory = (): PropertyDecorator =>
  ApiProperty({
    description: 'Категория цели',
    enum: GoalCategoryEnum,
    required: false,
    nullable: true,
  });

export const GoalTasks = (): PropertyDecorator =>
  ApiProperty({
    description: 'Задачи',
    type: TaskEntity,
    isArray: true,
    required: false,
    nullable: true,
  });

export const GoalHabits = (): PropertyDecorator =>
  ApiProperty({
    description: 'Привычки',
    type: HabitEntity,
    isArray: true,
    required: false,
    nullable: true,
  });

export const GoalAchievedTimestamp = (): PropertyDecorator =>
  ApiProperty({
    description: 'Время завершения цели',
    type: Number,
    required: false,
    nullable: true,
  });

export const GoalDeadlineTimestamp = (): PropertyDecorator =>
  ApiProperty({
    description: 'Время дедлайна цели',
    type: Number,
    required: false,
    nullable: true,
  });

export const GoalHistory = (): PropertyDecorator =>
  ApiProperty({
    description: 'История цели',
    type: HistoryEntity,
    isArray: true,
    required: false,
    nullable: true,
  });
