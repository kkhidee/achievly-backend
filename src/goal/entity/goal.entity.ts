import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
import { Habit, HabitEntity } from '@/goal/entity/habit.entity';
import { History, HistoryEntity } from '@/goal/entity/history.entity';
import { Task, TaskEntity } from '@/goal/entity/task.entity';
import { IGoal, TCreateGoal } from '@/goal/types/goal.types';
import { UserEntity } from '@/user/entity/user.entity';

@Entity()
export abstract class GoalEntity implements IGoal {
  @GoalId()
  @PrimaryGeneratedColumn()
  id: number;

  @GoalType()
  @Column({ type: 'enum', enum: GoalTypeEnum, default: GoalTypeEnum.Private })
  type: GoalTypeEnum;

  @GoalTitle()
  @Column()
  title: string;

  @GoalStatus()
  @Column({
    type: 'enum',
    enum: GoalStatusEnum,
    default: GoalStatusEnum.Ongoing,
  })
  status: GoalStatusEnum;

  @GoalNote()
  @Column({ nullable: true })
  note?: string;

  @GoalCategory()
  @Column({ type: 'enum', enum: GoalCategoryEnum, nullable: true })
  category?: GoalCategoryEnum;

  @GoalTasks()
  @Column('jsonb', { nullable: true })
  tasks?: TaskEntity[];

  @GoalHabits()
  @Column('jsonb', { nullable: true })
  habits?: HabitEntity[];

  @GoalAchievedTimestamp()
  @Column({ nullable: true, type: 'bigint' })
  achievedTimestamp?: number;

  @GoalDeadlineTimestamp()
  @Column({ nullable: true, type: 'bigint' })
  deadlineTimestamp?: number;

  @GoalHistory()
  @Column('jsonb', { nullable: true })
  history?: HistoryEntity[];

  @ManyToOne(() => UserEntity, user => user.goals)
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}

export class Goal extends GoalEntity {
  constructor(goal: TCreateGoal) {
    super();
    this.type = GoalTypeEnum.Private;
    this.title = goal.title;
    this.status = GoalStatusEnum.Ongoing;
    this.note = goal.note;
    this.category = goal.category;
    this.tasks = goal?.tasks?.map(task => new Task(task));
    this.habits = goal?.habits?.map(habit => new Habit(habit));
    this.deadlineTimestamp = goal.deadlineTimestamp;
    this.history = goal?.history?.map(history => new History(history));
    this.user = goal.user;
  }
}
