import { Injectable } from '@nestjs/common';
import { TGuardUser } from '@/auth/types/auth.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '@/user/user.service';
import { Event, EventEntity } from '@/event/entity/event.entity';
import { CreateEventDto, EventDto } from '@/event/dto/event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    private readonly userService: UserService,
  ) {}

  async getEvents(user: TGuardUser, period: string[]) {
    const events = await this.userService.getEvents({ userId: user.id });

    const [start, end] = period;

    return events
      .filter(event => {
        return (
          new Date(Number(event.start)) >= new Date(start) &&
          new Date(Number(event.end)) <= new Date(end)
        );
      })
      .map(event => new EventDto(event));
  }

  async createEvents(user: TGuardUser, events: CreateEventDto[]) {
    const fullUser = await this.userService.findById(user.id);

    for (const event of events) {
      await this.eventRepository.save(new Event({ ...event, user: fullUser }));
    }
  }

  async updateEvent(id: number, event: CreateEventDto) {
    await this.eventRepository.update(id, event);
  }

  async deleteEvent(id: number) {
    await this.eventRepository.delete(id);
  }
}
