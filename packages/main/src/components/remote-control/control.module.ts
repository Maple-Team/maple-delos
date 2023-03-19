import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ControlController } from './control.control'

const isProd = process.env.NODE_ENV === 'production'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REMOTE_CONTROL_SERVICE',
        transport: Transport.TCP,
        options: {
          host: isProd ? 'control-microservice' : 'localhost', // microservices host
          port: 8800, // microservices port
        },
      },
      {
        name: 'LOG_SERVICE',
        transport: Transport.TCP,
        options: {
          host: isProd ? 'log-microservice' : 'localhost',
          port: 8801,
        },
      },
      {
        name: 'MQTT_SERVICE',
        transport: Transport.MQTT,
        options: {
          url: isProd ? 'mqtt://mqtt-server:1883' : 'mqtt://localhost:1883',
        },
      },
    ]),
  ],
  controllers: [ControlController],
})
export class ControlModule {}
