import { ApiProperty } from '@nestjs/swagger';

import { IHabit } from '@/goal/types/goal.types';

export abstract class HabitEntity implements IHabit {
  @ApiProperty({
    description: 'ID привычки',
    type: String,
    required: true,
  })
  id: string;

  @ApiProperty({
    description: 'Заголовок привычки',
    type: String,
    required: true,
  })
  title: string;

  @ApiProperty({
    description: 'Дни повторения привычки',
    type: Number,
    required: true,
    isArray: true,
  })
  repeatDays: number[];

  @ApiProperty({
    description: 'Дни в которые привычка была выполнена',
    type: Number,
    required: false,
    isArray: true,
  })
  doneDays?: number[];

  @ApiProperty({
    description: 'Примечание к привычке',
    type: String,
    required: false,
    nullable: true,
  })
  note?: string;
}

export class Habit extends HabitEntity {
  constructor(habit: Partial<HabitEntity>) {
    super();
    this.id = habit.id;
    this.title = habit.title;
    this.repeatDays = habit.repeatDays;
    this.note = habit.note;
  }
}
