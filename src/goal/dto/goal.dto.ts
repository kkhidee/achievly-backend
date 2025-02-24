import { ApiProperty } from '@nestjs/swagger';

import {
  GoalCategoryEnum,
  GoalStatusEnum,
  GoalTypeEnum,
} from '@/constants/goal.constant';
import {
  GoalAchievedTimestamp,
  GoalCategory,
  GoalDeadlineTimestamp,
  GoalHabits,
  GoalHistory,
  GoalId,
  GoalNote,
  GoalStatus,
  GoalTasks,
  GoalTitle,
  GoalType,
} from '@/goal/decorators/goal.decorator';
import { GoalEntity } from '@/goal/entity/goal.entity';
import { HabitEntity } from '@/goal/entity/habit.entity';
import { HistoryEntity, HistoryGoalDto } from '@/goal/entity/history.entity';
import { TaskEntity } from '@/goal/entity/task.entity';
import { TStatistics } from '@/goal/types/goal.types';

export class GoalDto {
  @GoalId()
  id: number;

  @GoalType()
  type: GoalTypeEnum;

  @GoalTitle()
  title: string;

  @GoalStatus()
  status: GoalStatusEnum;

  @GoalNote()
  note?: string;

  @GoalCategory()
  category?: GoalCategoryEnum;

  @GoalTasks()
  tasks?: TaskEntity[];

  @GoalHabits()
  habits?: HabitEntity[];

  @GoalHistory()
  history?: HistoryEntity[];

  @GoalAchievedTimestamp()
  achievedTimestamp?: number;

  @GoalDeadlineTimestamp()
  deadlineTimestamp?: number;

  constructor(goal: Partial<GoalEntity>) {
    this.id = goal.id;
    this.type = goal.type;
    this.title = goal.title;
    this.status = goal.status;
    this.note = goal.note;
    this.category = goal.category;
    this.tasks = goal.tasks;
    this.habits = goal.habits;
    this.history = goal.history;
    this.achievedTimestamp = goal.achievedTimestamp
      ? Number(goal.achievedTimestamp)
      : null;
    this.deadlineTimestamp = goal.deadlineTimestamp
      ? Number(goal.deadlineTimestamp)
      : null;
  }
}

export class AllHistoryDto {
  @ApiProperty({
    description: 'Полная история',
    type: 'object',
    additionalProperties: {
      type: 'array',
      items: { $ref: '#/components/schemas/HistoryGoalDto' },
    },
    required: ['history'],
  })
  history: Record<number, HistoryGoalDto[]>;
}

export class StatisticsDto {
  @ApiProperty({
    description: 'Статистика',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        timestamp: { type: 'number' },
        goalsCompleted: { type: 'number' },
        habitsCompleted: { type: 'number' },
        tasksCompleted: { type: 'number' },
      },
    },
    required: true,
  })
  statistics: TStatistics[];
}
