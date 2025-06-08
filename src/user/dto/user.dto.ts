import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from '@/user/entity/user.entity';
import { GoalEntity } from '@/goal/entity/goal.entity';
import { EventEntity } from '@/event/entity/event.entity';
import { GoalDto } from '@/goal/dto/goal.dto';
import { EventDto } from '@/event/dto/event.dto';

export class UserDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'mail@mail.com',
  })
  email: string;

  @ApiProperty({
    type: String,
    example: 'Username',
  })
  username: string;

  @ApiProperty({
    type: String,
    example: 'https://picture.com',
  })
  picture: string;

  @ApiProperty({
    type: GoalDto,
    isArray: true,
    example: 'Username',
  })
  goals: GoalEntity[];

  @ApiProperty({
    type: EventDto,
    isArray: true,
    example: 'Username',
  })
  events: EventEntity[];

  constructor(user: UserEntity) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
    this.picture = user.picture;
    this.goals = user.goals;
    this.events = user.events;
  }
}
