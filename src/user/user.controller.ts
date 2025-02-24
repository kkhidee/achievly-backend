import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@/auth/guards/auth.guard';
import { TGuardUser } from '@/auth/types/auth.type';
import {
  BadRequestResponse,
  SuccessResponse,
} from '@/decorators/api.decorator';
import { UserDto } from '@/user/dto/user.dto';

import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @SuccessResponse({ type: UserDto })
  @BadRequestResponse()
  @ApiOperation({ operationId: 'getProfile', summary: 'Get profile' })
  @Get('/profile')
  async getProfile(@Req() request: { user: TGuardUser }) {
    const result = await this.userService.findById(request.user.id);

    return new UserDto(result);
  }
}
