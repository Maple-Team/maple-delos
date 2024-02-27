import { Module } from '@nestjs/common'
import { VideoController } from './videos.controller'

@Module({
  controllers: [VideoController],
})
export class VideoModule {}
