import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ProxyService } from './proxy.service'
import { ProxyController } from './proxy.controller'

@Module({
  controllers: [ProxyController],
  providers: [ProxyService],
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'MINIO_SERVICE',
        useFactory: () => {
          console.log('MINIO_SERVICE', process.env.MINIO_SERVICE, process.env.MINIO_PORT)
          return {
            transport: Transport.TCP,
            options: {
              host: process.env.MINIO_SERVICE,
              port: +process.env.MINIO_PORT,
            },
          }
        },
      },
    ]),
  ],
})
export class ProxyModule {}
