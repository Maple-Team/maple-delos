import { Module } from '@nestjs/common'
import { MinioModule } from '../minio/minio.module'
import { ProxyService } from './proxy.service'
import { ProxyController } from './proxy.controller'

@Module({
  imports: [MinioModule],
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}
