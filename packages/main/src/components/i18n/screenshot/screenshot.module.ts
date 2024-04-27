import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScreenshotService } from './screenshot.service'
import { Screenshots } from './entities'

@Module({
  providers: [ScreenshotService],
  imports: [TypeOrmModule.forFeature([Screenshots])],
})
export class ScreenshotModule {}
