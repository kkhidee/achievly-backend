import { ApiProperty } from '@nestjs/swagger';

import { GoalDto } from '@/goal/dto/goal.dto';
import { HabitEntity } from '@/goal/entity/habit.entity';
import { TaskEntity } from '@/goal/entity/task.entity';
import {
  getAvailableHabits,
  getAvailableTasks,
} from '@/goal/helpers/goal.helper';
import { IGoalHistory } from '@/goal/types/goal.types';

export class HistoryGoalDto {
  @ApiProperty({
    description: 'ID цели',
    type: Number,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: 'Заголовок',
    type: String,
    required: true,
  })
  title: string;

  @ApiProperty({
    description: 'Задачи',
    type: TaskEntity,
    isArray: true,
    required: false,
    nullable: true,
  })
  tasks?: TaskEntity[];

  @ApiProperty({
    description: 'Привычки',
    type: HabitEntity,
    isArray: true,
    required: false,
    nullable: true,
  })
  habits?: HabitEntity[];

  constructor(goal: Partial<GoalDto>) {
    this.id = goal.id;
    this.title = goal.title;
    this.tasks = getAvailableTasks(goal?.tasks || []) || [];
    this.habits = getAvailableHabits(goal?.habits || []) || [];
  }
}

export abstract class HistoryEntity implements IGoalHistory {
  @ApiProperty({
    description: 'Дата истории цели',
    type: Number,
    required: true,
  })
  date: number;

  @ApiProperty({
    description: 'Цель',
    type: HistoryGoalDto,
    required: true,
  })
  goal: HistoryGoalDto;
}

export class History extends HistoryEntity {
  constructor(history: Partial<HistoryEntity>) {
    super();
    this.date = history.date;
    this.goal = history.goal;
  }
}
