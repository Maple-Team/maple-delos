import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ControlController } from './control.control'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REMOTE_CONTROL_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.REMOTE_CONTROL_SERVICE,
          port: 8800,
        },
      },
      {
        name: 'LOG_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.LOG_SERVICE,
          port: 8801,
        },
      },
      {
        name: 'MQTT_SERVICE',
        transport: Transport.MQTT,
        options: {
          url: process.env.MQTT_SERVICE,
          clientId: process.env.MQTT_SERVICE_CLIENT_ID,
        },
      },
    ]),
  ],
  controllers: [ControlController],
})
export class ControlModule {}
