import { z } from 'zod';

import { ZOD_ERROR } from '@/constants/error.constant';
import { GoalCategoryEnum, GoalStatusEnum } from '@/constants/goal.constant';

export const TaskSchema = z.object({
  id: z.string(ZOD_ERROR),
  title: z.string(ZOD_ERROR),
  done: z.boolean(ZOD_ERROR),
  note: z.string(ZOD_ERROR).optional().nullable(),
  deadlineTimestamp: z.number(ZOD_ERROR).optional().nullable(),
  doneTimestamp: z.number(ZOD_ERROR).optional().nullable(),
});

export const HabitSchema = z.object({
  id: z.string(ZOD_ERROR),
  title: z.string(ZOD_ERROR),
  repeatDays: z.array(z.number(ZOD_ERROR)),
  doneDays: z.array(z.number(ZOD_ERROR)).optional(),
  note: z.string(ZOD_ERROR).optional().nullable(),
});

export const GoalSchema = z.object({
  type: z.string(ZOD_ERROR).optional().nullable(),
  title: z.string(ZOD_ERROR),
  note: z.string(ZOD_ERROR).optional().nullable(),
  category: z
    .enum([
      GoalCategoryEnum.Education,
      GoalCategoryEnum.Career,
      GoalCategoryEnum.Finance,
      GoalCategoryEnum.Health,
      GoalCategoryEnum.Sports,
      GoalCategoryEnum.Relationships,
      GoalCategoryEnum.Travel,
      GoalCategoryEnum.Creativity,
      GoalCategoryEnum.Business,
      GoalCategoryEnum.PersonalGrowth,
      GoalCategoryEnum.Charity,
      GoalCategoryEnum.Hobby,
      GoalCategoryEnum.Spirituality,
      GoalCategoryEnum.Ecology,
      GoalCategoryEnum.SocialActivity,
    ])
    .optional()
    .nullable(),
  tasks: z.array(TaskSchema).optional().nullable(),
  habits: z.array(HabitSchema).optional().nullable(),
  deadlineTimestamp: z.number(ZOD_ERROR).optional().nullable(),
});

export const GoalIdSchema = z.object({
  id: z.string(ZOD_ERROR),
});

export const GetGoalsSchema = z.object({
  status: z.enum([GoalStatusEnum.Ongoing, GoalStatusEnum.Achieved]).optional(),
});

export const GetStatisticsSchema = z
  .array(z.string(ZOD_ERROR), ZOD_ERROR)
  .nonempty();

export const GetPublicGoalsSchema = z.object({
  search: z.string(ZOD_ERROR).optional(),
  category: z.string(ZOD_ERROR).optional(),
});

export const EventSchema = z.object({
  title: z.string(ZOD_ERROR),
  start: z.number(ZOD_ERROR),
  end: z.number(ZOD_ERROR),
});
