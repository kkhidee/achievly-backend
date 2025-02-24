import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { TGuardUser } from '@/auth/types/auth.type';
import {
  GOAL_NOT_FOUND,
  HABIT_NOT_FOUND,
  TASK_NOT_FOUND,
} from '@/constants/error.constant';
import {
  GoalCategoryEnum,
  GoalStatusEnum,
  GoalTypeEnum,
} from '@/constants/goal.constant';
import { AllHistoryDto, GoalDto } from '@/goal/dto/goal.dto';
import { Goal, GoalEntity } from '@/goal/entity/goal.entity';
import { Habit, HabitEntity } from '@/goal/entity/habit.entity';
import { HistoryGoalDto } from '@/goal/entity/history.entity';
import { Task, TaskEntity } from '@/goal/entity/task.entity';
import { getStartOfDayTimestamp } from '@/goal/helpers/goal.helper';
import {
  TCreateGoal,
  TGetGoalsParams,
  TGetPublicGoals,
  TGoalIdSchema,
  TStatisticsCompletedEntity,
  TUpdateGoalBody,
} from '@/goal/types/goal.types';
import { UserService } from '@/user/user.service';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(GoalEntity)
    private readonly goalRepository: Repository<GoalEntity>,
    private readonly userService: UserService,
  ) {}

  async getGoals({ id }: TGuardUser, params?: TGetGoalsParams) {
    const goals = await this.userService.getGoals({ userId: id });

    if (params?.status) {
      return goals
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .filter(goal => goal.status === params.status)
        .map(goal => new GoalDto(goal));
    }

    return goals
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .map(goal => new GoalDto(goal));
  }

  async getGoal({ id }: TGuardUser, params: TGoalIdSchema) {
    const goals = await this.userService.getGoals({ userId: id });

    const found = goals.find(goal => goal.id === Number(params.id));

    return found ? new GoalDto(found) : undefined;
  }

  async create(goalBody: Omit<TCreateGoal, 'user'>, { id }: TGuardUser) {
    const user = await this.userService.findById(id);

    const goal = new Goal({ ...goalBody, user });

    return await this.goalRepository.save(goal);
  }

  async updateGoal(id: number, body: TUpdateGoalBody, user: TGuardUser) {
    const goal = await this.findById(id, user);

    if (!goal) {
      throw new BadRequestException(GOAL_NOT_FOUND);
    }

    const updatedGoal = {
      ...goal,
      type: (body?.type as GoalTypeEnum) || goal.type,
      title: body?.title || goal.title,
      note: body?.note || goal.note,
      category: body?.category || goal.category,
      deadlineTimestamp: body?.deadlineTimestamp || goal.deadlineTimestamp,
      tasks: (body?.tasks as TaskEntity[]) || goal.tasks,
      habits: (body?.habits as HabitEntity[]) || goal.habits,
    };

    const { history } = this.updateHistory(updatedGoal);

    await this.goalRepository.update(goal.id, { ...updatedGoal, history });
  }

  async achieve(id: number, user: TGuardUser) {
    const goal = await this.findById(id, user);

    if (!goal) {
      throw new BadRequestException(GOAL_NOT_FOUND);
    }

    goal.status = GoalStatusEnum.Achieved;
    goal.achievedTimestamp = getStartOfDayTimestamp();

    const { history } = this.updateHistory(goal);

    await this.goalRepository.update(goal.id, { ...goal, history });
  }

  async toggleTaskComplete(goalId: number, taskId: string, user: TGuardUser) {
    const goal = await this.findById(goalId, user);

    if (!goal) {
      throw new BadRequestException(GOAL_NOT_FOUND);
    }

    if (!goal?.tasks?.some(task => task.id === taskId)) {
      throw new BadRequestException(TASK_NOT_FOUND);
    }

    const updatedGoal = {
      ...goal,
      tasks: (goal?.tasks || []).map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            done: !task.done,
            doneTimestamp: !task.done ? getStartOfDayTimestamp() : undefined,
          };
        }

        return task;
      }),
    };

    const { history } = this.updateHistory(updatedGoal);

    await this.goalRepository.update(goal.id, { ...updatedGoal, history });
  }

  async toggleHabitComplete(goalId: number, habitId: string, user: TGuardUser) {
    const goal = await this.findById(goalId, user);

    if (!goal) {
      throw new BadRequestException(GOAL_NOT_FOUND);
    }

    if (!goal?.habits?.some(habit => habit.id === habitId)) {
      throw new BadRequestException(HABIT_NOT_FOUND);
    }

    const updatedGoal = {
      ...goal,
      habits: (goal?.habits || []).map(habit => {
        if (habit.id === habitId) {
          const isIncludeDay = (habit?.doneDays || []).some(
            day => day === getStartOfDayTimestamp(),
          );

          return {
            ...habit,
            doneDays: isIncludeDay
              ? (habit?.doneDays || [])?.filter(
                  day => !(day === getStartOfDayTimestamp()),
                )
              : [...(habit?.doneDays || []), getStartOfDayTimestamp()],
          };
        }

        return habit;
      }),
    };

    const { history } = this.updateHistory(updatedGoal);

    await this.goalRepository.update(goal.id, { ...updatedGoal, history });
  }

  async getAllHistory(user: TGuardUser): Promise<AllHistoryDto> {
    const goals = await this.getGoals(user);

    const updatedGoals = goals.map(goal => {
      const { history } = this.updateHistory(goal);

      this.goalRepository.update(goal.id, { ...goal, history });

      return { ...goal, history };
    });

    return {
      history: updatedGoals
        .map(goal => goal.history)
        .reduce(
          (acc, history) => {
            const obj = { ...acc };

            history.forEach(element => {
              obj[element.date] = [...(obj[element.date] || []), element.goal];
            });

            return obj;
          },
          {} as Record<number, HistoryGoalDto[]>,
        ),
    };
  }

  async getStatistics(user: TGuardUser, period: string[]) {
    const goals = await this.getGoals(user);

    const start = new Date(period[0]);

    const end = new Date(period[1]);

    const timestamps: number[] = [];

    const current = new Date(start);

    while (current <= end) {
      timestamps.push(current.getTime());
      current.setDate(current.getDate() + 1);
    }

    const statistics = timestamps.map(timestamp => {
      const { goalsCompleted, habitsCompleted, tasksCompleted } = goals.reduce(
        (acc, goal) => {
          const habitsCompleted = (goal?.habits || []).filter(habit =>
            habit?.doneDays?.includes(timestamp),
          ).length;
          const tasksCompleted = (goal?.tasks || []).filter(
            task => task.done && task.doneTimestamp === timestamp,
          ).length;

          return {
            goalsCompleted:
              acc.goalsCompleted +
              Number(goal?.achievedTimestamp === timestamp),
            habitsCompleted: acc.habitsCompleted + habitsCompleted,
            tasksCompleted: acc.tasksCompleted + tasksCompleted,
          };
        },
        {
          goalsCompleted: 0,
          habitsCompleted: 0,
          tasksCompleted: 0,
        } as TStatisticsCompletedEntity,
      );

      return { timestamp, goalsCompleted, habitsCompleted, tasksCompleted };
    });

    return { statistics };
  }

  async getPublicGoals({ search, category }: TGetPublicGoals) {
    const goals = await this.goalRepository.find({
      where: {
        type: GoalTypeEnum.Public,
        category: category as GoalCategoryEnum,
        title: search ? ILike(`%${search}%`) : undefined,
      },
    });

    return (goals || [])
      .sort((a, b) => a.title.localeCompare(b.title))
      .map(
        goal =>
          new GoalDto({
            ...goal,
            status: GoalStatusEnum.Ongoing,
            habits: goal?.habits?.map(habit => new Habit(habit)),
            tasks: goal?.tasks?.map(task => new Task(task)),
            history: [],
            achievedTimestamp: null,
          }),
      );
  }

  updateHistory(goal: Partial<GoalDto>) {
    const currentDayTimestamp = getStartOfDayTimestamp();

    // Обновление существующей записи
    if (
      !!goal?.history?.find(history => history.date === currentDayTimestamp)
    ) {
      return {
        history: goal?.history.map(history => {
          if (history.date === currentDayTimestamp) {
            return { ...history, goal: new HistoryGoalDto(goal) };
          }

          return history;
        }),
      };
    }

    return {
      history: [
        ...(goal?.history || []),
        {
          date: currentDayTimestamp,
          goal: new HistoryGoalDto(goal),
        },
      ],
    };
  }

  async delete(id: number) {
    await this.goalRepository.delete({ id });
  }

  async deleteTask(goalId: number, taskId: string, user: TGuardUser) {
    const goal = await this.findById(goalId, user);

    if (!goal) {
      throw new BadRequestException(GOAL_NOT_FOUND);
    }

    const updatedGoal = {
      ...goal,
      tasks: goal?.tasks?.filter(task => task.id !== taskId),
    };

    const { history } = this.updateHistory(updatedGoal);

    await this.goalRepository.update(goal.id, { ...updatedGoal, history });
  }

  async deleteHabit(goalId: number, habitId: string, user: TGuardUser) {
    const goal = await this.findById(goalId, user);

    if (!goal) {
      throw new BadRequestException(GOAL_NOT_FOUND);
    }

    const updatedGoal = {
      ...goal,
      habits: goal?.habits?.filter(habit => habit.id !== habitId),
    };

    const { history } = this.updateHistory(updatedGoal);

    await this.goalRepository.update(goal.id, { ...updatedGoal, history });
  }

  async findById(id: number, user: TGuardUser): Promise<GoalEntity> {
    const goal = await this.goalRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (goal?.user?.id !== user?.id) {
      return undefined;
    }

    return goal;
  }
}
