import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REMOTE_CONTROL_SERVICE',
        transport: Transport.TCP,
        options: {
          // host: '192.168.108.188', // microservices host
          port: 8800, // microservices port
        },
      },
      {
        name: 'LOG_SERVICE',
        transport: Transport.TCP,
        options: {
          // host: '192.168.108.188',
          port: 8801,
        },
      },
    ]),
  ],
})
export class ControlModule {}
