import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IEvent } from '@/goal/types/goal.types';
import { UserEntity } from '@/user/entity/user.entity';

@Entity()
export abstract class EventEntity implements IEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: false, type: 'bigint' })
  start: number;

  @Column({ nullable: false, type: 'bigint' })
  end: number;

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

export class Event extends EventEntity {
  constructor(event: Partial<EventEntity>) {
    super();
    this.title = event.title;
    this.start = event.start;
    this.end = event.end;
    this.user = event.user;
  }
}
