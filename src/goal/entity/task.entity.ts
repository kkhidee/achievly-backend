import { ApiProperty } from '@nestjs/swagger';

import { ITask } from '@/goal/types/goal.types';

export abstract class TaskEntity implements ITask {
  @ApiProperty({
    description: 'ID задачи',
    type: String,
    required: true,
  })
  id: string;

  @ApiProperty({
    description: 'Заголовок задачи',
    type: String,
    required: true,
  })
  title: string;

  @ApiProperty({
    description: 'Статус выполнения задачи',
    type: Boolean,
    required: true,
    default: false,
  })
  done: boolean;

  @ApiProperty({
    description: 'Примечание к задаче',
    type: String,
    required: false,
    nullable: true,
  })
  note?: string;

  @ApiProperty({
    description: 'Срок выполнения задачи',
    type: Number,
    required: false,
    nullable: true,
  })
  deadlineTimestamp?: number;

  @ApiProperty({
    description: 'Дата выполнения задачи',
    type: Number,
    required: false,
    nullable: true,
  })
  doneTimestamp?: number;
}

export class Task extends TaskEntity {
  constructor(task: Partial<TaskEntity>) {
    super();
    this.id = task.id;
    this.title = task.title;
    this.done = false;
    this.note = task.note;
    this.deadlineTimestamp = task.deadlineTimestamp;
  }
}
