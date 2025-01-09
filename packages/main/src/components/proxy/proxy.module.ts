import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ProxyService } from './proxy.service'
import { ProxyController } from './proxy.controller'

@Module({
  controllers: [ProxyController],
  providers: [ProxyService],
  imports: [
    ClientsModule.register([
      {
        name: 'MINIO_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.MINIO_SERVICE,
          port: 3002,
        },
      },
    ]),
  ],
})
export class ProxyModule {}
