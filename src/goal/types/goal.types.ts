import { z } from 'zod';

import { GoalCategoryEnum, GoalStatusEnum } from '@/constants/goal.constant';
import { GoalEntity } from '@/goal/entity/goal.entity';
import { HistoryGoalDto } from '@/goal/entity/history.entity';
import {
  GetGoalsSchema,
  GetPublicGoalsSchema,
  GoalIdSchema,
  GoalSchema,
} from '@/goal/schemas/goal.schema';
import { UserEntity } from '@/user/entity/user.entity';

export interface IGoal {
  id: number;
  title: string;
  status: GoalStatusEnum;
  note?: string;
  category?: GoalCategoryEnum;
  tasks?: ITask[];
  habits?: IHabit[];
  achievedTimestamp?: number;
  deadlineTimestamp?: number;
  history?: IGoalHistory[];
  user: UserEntity;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEvent {
  id: number;
  title: string;
  start: number;
  end: number;
  user: UserEntity;
}

export interface IGoalHistory {
  date: number;
  goal: HistoryGoalDto;
}

export interface ITask {
  id: string;
  title: string;
  done: boolean;
  note?: string;
  deadlineTimestamp?: number;
  doneTimestamp?: number;
}

export interface IHabit {
  id: string;
  title: string;
  repeatDays: number[];
  doneDays?: number[];
  note?: string;
}

export type TCreateGoal = Omit<GoalEntity, 'id' | 'createdAt' | 'updatedAt'>;

export type TGetGoalsParams = z.infer<typeof GetGoalsSchema>;

export type TGoalIdSchema = z.infer<typeof GoalIdSchema>;

export type TUpdateGoalBody = z.infer<typeof GoalSchema>;

export type TGetPublicGoals = z.infer<typeof GetPublicGoalsSchema>;

export type TStatisticsCompletedEntity = {
  goalsCompleted: number;
  habitsCompleted: number;
  tasksCompleted: number;
};

export type TStatistics = {
  timestamp: number;
  goalsCompleted: number;
  habitsCompleted: number;
  tasksCompleted: number;
};
