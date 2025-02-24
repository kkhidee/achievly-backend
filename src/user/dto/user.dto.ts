import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from '@/user/entity/user.entity';

export class UserDto {
  @ApiProperty({
    description: 'User ID',
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Email пользователя',
    type: String,
    example: 'mail@mail.com',
  })
  email: string;

  @ApiProperty({
    description: 'Имя пользователя',
    type: String,
    example: 'Username',
  })
  username: string;

  @ApiProperty({
    description: 'Изображение пользователя',
    type: String,
    example: 'https://picture.com',
  })
  picture: string;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
    this.picture = user.picture;
  }
}
