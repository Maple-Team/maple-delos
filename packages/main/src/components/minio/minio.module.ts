import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { MinioService } from './minio.service'
import { MinioController } from './minio.controller'

@Module({
  controllers: [MinioController],
  providers: [MinioService],
  imports: [
    ClientsModule.register([
      {
        name: 'MINIO_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.MINIO_SERVICE,
          port: 8801,
        },
      },
    ]),
  ],
})
export class MinioModule {}
