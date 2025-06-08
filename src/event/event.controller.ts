import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  BadRequestResponse,
  SuccessResponse,
} from '@/decorators/api.decorator';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TGuardUser } from '@/auth/types/auth.type';
import { Request } from 'express';
import {
  EventSchema,
  GetStatisticsSchema,
  GoalIdSchema,
} from '@/goal/schemas/goal.schema';
import { WRONG_BODY, WRONG_PARAMS } from '@/constants/error.constant';
import { EventService } from '@/event/event.service';
import { CreateEventDto, EventDto } from '@/event/dto/event.dto';
import { JwtAuthGuard } from '@/auth/guards/auth.guard';
import { z } from 'zod';

@ApiTags('Events')
@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('/all')
  @SuccessResponse({ type: EventDto, isArray: true })
  @BadRequestResponse()
  @ApiOperation({ operationId: 'getAllEvents', summary: 'Get all events' })
  @ApiQuery({ type: String, isArray: true, name: 'period' })
  async getAllEvents() {
    return await this.eventService.getAllEvents();
  }

  @Get('/')
  @SuccessResponse({ type: EventDto, isArray: true })
  @BadRequestResponse()
  @ApiOperation({ operationId: 'getEvents', summary: 'Get events' })
  @ApiQuery({ type: String, isArray: true, name: 'period' })
  async getEvents(@Req() request: { user: TGuardUser } & Request) {
    const { user, query } = request;

    const { data, error } = GetStatisticsSchema.safeParse(query['period[]']);

    if (error) throw new BadRequestException(WRONG_PARAMS);

    return await this.eventService.getEvents(user, data);
  }

  @Post('/')
  @SuccessResponse()
  @BadRequestResponse()
  @ApiOperation({ operationId: 'createEvents', summary: 'Create events' })
  @ApiBody({ type: CreateEventDto, isArray: true })
  async createEvents(@Req() request: { user: TGuardUser } & Request) {
    const { user, body } = request;

    const { data, error } = z.array(EventSchema).safeParse(body);

    if (error) throw new BadRequestException(WRONG_BODY);

    return await this.eventService.createEvents(user, data as CreateEventDto[]);
  }

  @Put('/:id')
  @SuccessResponse()
  @BadRequestResponse()
  @ApiOperation({ operationId: 'updateEvent', summary: 'Update event' })
  @ApiParam({ type: String, name: 'id' })
  @ApiBody({ type: CreateEventDto })
  async updateEvent(@Req() request: { user: TGuardUser } & Request) {
    const { body, params } = request;

    const { data: paramsData, error: paramsError } =
      GoalIdSchema.safeParse(params);

    const { data: bodyData, error: bodyError } = EventSchema.safeParse(body);

    if (paramsError) throw new BadRequestException(WRONG_PARAMS);

    if (bodyError) throw new BadRequestException(WRONG_BODY);

    return await this.eventService.updateEvent(
      Number(paramsData.id),
      bodyData as CreateEventDto,
    );
  }

  @Delete('/:id')
  @SuccessResponse()
  @BadRequestResponse()
  @ApiOperation({ operationId: 'deleteEvent', summary: 'Delete event' })
  @ApiParam({ type: String, name: 'id' })
  async deleteEvent(@Req() request: { user: TGuardUser } & Request) {
    const { params } = request;

    const { data: paramsData, error: paramsError } =
      GoalIdSchema.safeParse(params);

    if (paramsError) throw new BadRequestException(WRONG_PARAMS);

    return await this.eventService.deleteEvent(Number(paramsData.id));
  }
}
