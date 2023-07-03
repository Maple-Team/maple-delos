import { Module } from '@nestjs/common'
import { EventsGateway } from './events.gateway'
import { DefaultGateway } from './default.gateway'
import { DefaultGatewayController } from './default.controller'

@Module({
  providers: [EventsGateway, DefaultGateway],
  controllers: [DefaultGatewayController],
})
export class GatewaysModule {}
