import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

import { HabitEntity } from '@/goal/entity/habit.entity';
import { TaskEntity } from '@/goal/entity/task.entity';

dayjs.extend(utc);

export const getStartOfDayTimestamp = (date?: number): number => {
  if (date) return dayjs.utc(date).startOf('day').valueOf();

  return dayjs.utc().startOf('day').valueOf();
};

export const isAvailableHabit = (habit: HabitEntity) => {
  return habit?.repeatDays?.some(day => {
    return dayjs().day() === day;
  });
};

export const isAvailableTask = (task: TaskEntity) => {
  return (
    !task.done ||
    (task.done && task?.doneTimestamp === getStartOfDayTimestamp())
  );
};

export const getAvailableHabits = (habits: HabitEntity[] | undefined) => {
  return habits?.filter(isAvailableHabit);
};

export const getAvailableTasks = (tasks: TaskEntity[] | undefined) => {
  return tasks?.filter(isAvailableTask);
};
