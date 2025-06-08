import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

import { JwtAuthGuard } from '@/auth/guards/auth.guard';
import { TGuardUser } from '@/auth/types/auth.type';
import {
  GOAL_ID_MISSING,
  HABIT_ID_MISSING,
  TASK_ID_MISSING,
  WRONG_BODY,
  WRONG_PARAMS,
} from '@/constants/error.constant';
import {
  BadRequestResponse,
  SuccessResponse,
} from '@/decorators/api.decorator';
import { AllHistoryDto, GoalDto, StatisticsDto } from '@/goal/dto/goal.dto';
import { GoalService } from '@/goal/goal.service';
import {
  GetGoalsSchema,
  GetPublicGoalsSchema,
  GetStatisticsSchema,
  GoalIdSchema,
  GoalSchema,
} from '@/goal/schemas/goal.schema';
import { TCreateGoal } from '@/goal/types/goal.types';

@ApiTags('Goals')
@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Get('/all')
  @SuccessResponse({ type: GoalDto, isArray: true })
  @BadRequestResponse()
  @ApiOperation({ operationId: 'getAllGoals', summary: 'Get all goals' })
  @ApiQuery({ type: String, name: 'status' })
  async getAllGoals() {
    return await this.goalService.getAllGoals();
  }

  @Get('/')
  @SuccessResponse({ type: GoalDto, isArray: true })
  @BadRequestResponse()
  @ApiOperation({ operationId: 'getGoals', summary: 'Get goals' })
  @ApiQuery({ type: String, name: 'status' })
  async getGoals(@Req() request: { user: TGuardUser } & Request) {
    const { user, query } = request;

    const { data, error } = GetGoalsSchema.safeParse(query);

    if (error) throw new BadRequestException(WRONG_PARAMS);

    return await this.goalService.getGoals(user, data);
  }

  @Get('/history')
  @SuccessResponse({ type: AllHistoryDto })
  @BadRequestResponse()
  @ApiOperation({ operationId: 'getAllHistory', summary: 'Get all history' })
  async getAllHistory(@Req() request: { user: TGuardUser } & Request) {
    const { user } = request;

    return await this.goalService.getAllHistory(user);
  }

  @Get('/statistics')
  @SuccessResponse({ type: StatisticsDto })
  @BadRequestResponse()
  @ApiOperation({ operationId: 'getStatistics', summary: 'Get statistics' })
  @ApiQuery({ type: String, isArray: true, name: 'period' })
  async getStatistics(@Req() request: { user: TGuardUser } & Request) {
    const { user, query } = request;

    const { data, error } = GetStatisticsSchema.safeParse(query['period[]']);

    if (error) throw new BadRequestException(WRONG_PARAMS);

    return await this.goalService.getStatistics(user, data);
  }

  @Get('/public')
  @SuccessResponse({ type: GoalDto, isArray: true })
  @BadRequestResponse()
  @ApiOperation({ operationId: 'getPublicGoals', summary: 'Get public goals' })
  @ApiQuery({ type: String, name: 'search', required: false })
  @ApiQuery({ type: String, name: 'category', required: false })
  async getPublicGoals(@Req() request: Request) {
    const { query } = request;

    const { data, error } = GetPublicGoalsSchema.safeParse(query);

    if (error) throw new BadRequestException(WRONG_PARAMS);

    return await this.goalService.getPublicGoals(data);
  }

  @Get('/:id')
  @SuccessResponse({ type: GoalDto })
  @BadRequestResponse()
  @ApiOperation({ operationId: 'getGoal', summary: 'Get goal' })
  @ApiParam({ type: String, name: 'id' })
  async getGoal(@Req() request: { user: TGuardUser } & Request) {
    const { user, params } = request;

    const { data, error } = GoalIdSchema.safeParse(params);

    if (error) throw new BadRequestException(WRONG_PARAMS);

    return await this.goalService.getGoal(user, data);
  }

  @Post('/')
  @SuccessResponse()
  @BadRequestResponse()
  @ApiOperation({ operationId: 'createGoal', summary: 'Create goal' })
  @ApiBody({ type: GoalDto })
  async createGoal(@Req() request: { user: TGuardUser } & Request) {
    const { user } = request;

    const { data, error } = GoalSchema.safeParse(request.body);

    if (error) {
      throw new BadRequestException(WRONG_BODY);
    }

    await this.goalService.create(data as Omit<TCreateGoal, 'user'>, user);

    return;
  }

  @Put('/:id')
  @SuccessResponse()
  @BadRequestResponse()
  @ApiOperation({ operationId: 'updateGoal', summary: 'Update goal' })
  @ApiBody({ type: GoalDto })
  @ApiParam({ type: String, name: 'id' })
  async updateGoal(@Req() request: { user: TGuardUser } & Request) {
    const { params, body, user } = request;

    const { data: paramsData, error: paramsError } =
      GoalIdSchema.safeParse(params);

    const { data: bodyData, error: bodyError } = GoalSchema.safeParse(body);

    if (paramsError) {
      throw new BadRequestException(GOAL_ID_MISSING);
    }

    if (bodyError) {
      throw new BadRequestException(WRONG_BODY);
    }

    return await this.goalService.updateGoal(
      Number(paramsData.id),
      bodyData,
      user,
    );
  }

  @Patch('/:id')
  @SuccessResponse()
  @BadRequestResponse()
  @ApiOperation({ operationId: 'achieveGoal', summary: 'Achieve goal' })
  @ApiParam({ type: String, name: 'id' })
  async achieveGoal(@Req() request: { user: TGuardUser } & Request) {
    const { params, user } = request;

    const { data, error } = GoalIdSchema.safeParse(params);

    if (error) {
      throw new BadRequestException(GOAL_ID_MISSING);
    }

    return await this.goalService.achieve(Number(data.id), user);
  }

  @Patch('/:id/task/:taskId')
  @SuccessResponse()
  @BadRequestResponse()
  @ApiOperation({
    operationId: 'toggleTaskComplete',
    summary: 'Toggle task complete',
  })
  @ApiParam({ type: String, name: 'id' })
  @ApiParam({ type: String, name: 'taskId' })
  async toggleTaskComplete(@Req() request: { user: TGuardUser } & Request) {
    const { params, user } = request;

    const { id, taskId } = params as { id: string; taskId: string };

    if (!id) {
      throw new BadRequestException(GOAL_ID_MISSING);
    }

    if (!taskId) {
      throw new BadRequestException(TASK_ID_MISSING);
    }

    return await this.goalService.toggleTaskComplete(Number(id), taskId, user);
  }

  @Patch('/:id/habit/:habitId')
  @SuccessResponse()
  @BadRequestResponse()
  @ApiOperation({
    operationId: 'toggleHabitComplete',
    summary: 'Toggle habit complete',
  })
  @ApiParam({ type: String, name: 'id' })
  @ApiParam({ type: String, name: 'habitId' })
  async toggleHabitComplete(@Req() request: { user: TGuardUser } & Request) {
    const { params, user } = request;

    const { id, habitId } = params as { id: string; habitId: string };

    if (!id) {
      throw new BadRequestException(GOAL_ID_MISSING);
    }

    if (!habitId) {
      throw new BadRequestException(HABIT_ID_MISSING);
    }

    return await this.goalService.toggleHabitComplete(
      Number(id),
      habitId,
      user,
    );
  }

  @Delete('/:id')
  @SuccessResponse()
  @BadRequestResponse()
  @ApiOperation({ operationId: 'deleteGoal', summary: 'Delete goal' })
  @ApiParam({ type: String, name: 'id' })
  async deleteGoal(@Req() request: Request) {
    const { params } = request;

    const { data, error } = GoalIdSchema.safeParse(params);

    if (error) {
      throw new BadRequestException(GOAL_ID_MISSING);
    }

    return await this.goalService.delete(Number(data.id));
  }

  @Delete('/:goalId/task/:taskId')
  @SuccessResponse()
  @BadRequestResponse()
  @ApiOperation({ operationId: 'deleteTask', summary: 'Delete task' })
  @ApiParam({ type: String, name: 'goalId' })
  @ApiParam({ type: String, name: 'taskId' })
  async deleteTask(@Req() request: { user: TGuardUser } & Request) {
    const { params, user } = request;

    if (!params?.goalId) {
      throw new BadRequestException(GOAL_ID_MISSING);
    }

    if (!params?.taskId) {
      throw new BadRequestException(TASK_ID_MISSING);
    }

    return await this.goalService.deleteTask(
      Number(params.goalId),
      params.taskId,
      user,
    );
  }

  @Delete('/:goalId/habit/:habitId')
  @SuccessResponse()
  @BadRequestResponse()
  @ApiOperation({ operationId: 'deleteHabit', summary: 'Delete habit' })
  @ApiParam({ type: String, name: 'goalId' })
  @ApiParam({ type: String, name: 'habitId' })
  async deleteHabit(@Req() request: { user: TGuardUser } & Request) {
    const { params, user } = request;

    if (!params?.goalId) {
      throw new BadRequestException(GOAL_ID_MISSING);
    }

    if (!params?.habitId) {
      throw new BadRequestException(HABIT_ID_MISSING);
    }

    return await this.goalService.deleteHabit(
      Number(params.goalId),
      params.habitId,
      user,
    );
  }
}
