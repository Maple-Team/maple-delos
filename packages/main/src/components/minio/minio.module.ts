import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { MinioService } from './minio.service'
import { MinioController } from './minio.controller'

@Module({
  controllers: [MinioController],
  providers: [MinioService],
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'MINIO_SERVICE',
        useFactory: () => {
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
  exports: [MinioService],
})
export class MinioModule {}
