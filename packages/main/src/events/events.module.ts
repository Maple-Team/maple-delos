import { Module } from '@nestjs/common'
import { EventsGateway } from './events.gateway'
import { DefaultGateway } from './default.gateway'
@Module({
  providers: [EventsGateway, DefaultGateway],
})
export class EventsModule {}
