import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScreenshotService } from './screenshot.service'
import { Screenshots } from './entities' 
import { MinioModule } from '@/components/minio/minio.module'
import { ScreenshotController } from './screenshot.controller'

@Module({
  providers: [ScreenshotService],
  imports: [TypeOrmModule.forFeature([Screenshots]), MinioModule],
  exports:[ScreenshotService],
  controllers: [ScreenshotController],
})
export class ScreenshotModule {}
