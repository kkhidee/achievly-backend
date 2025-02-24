import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { GoalEntity } from '@/goal/entity/goal.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Email пользователя',
    type: String,
    example: 'mail@mail.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Имя пользователя',
    type: String,
    example: 'Username',
  })
  @Column({ unique: false })
  username: string;

  @ApiProperty({
    description: 'Изображение пользователя',
    type: String,
    example: 'https://picture.com',
  })
  @Column()
  picture: string;

  @OneToMany(() => GoalEntity, goal => goal.user)
  goals: GoalEntity[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
