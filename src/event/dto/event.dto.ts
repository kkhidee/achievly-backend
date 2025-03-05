import { ApiProperty } from '@nestjs/swagger';
import { EventEntity } from '@/event/entity/event.entity';

export class EventDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: Number })
  start: number;

  @ApiProperty({ type: Number })
  end: number;

  constructor(event: Partial<EventEntity>) {
    this.id = event.id;
    this.title = event.title;
    this.start = Number(event.start);
    this.end = Number(event.end);
  }
}

export class CreateEventDto {
  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: Number })
  start: number;

  @ApiProperty({ type: Number })
  end: number;
}
