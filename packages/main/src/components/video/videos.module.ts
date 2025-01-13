import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { VideoController } from './videos.controller'
import { VideoService } from './videos.service'
import { Video, VideoSchema } from './schemas/video.schema'
import { Actress, ActressSchema } from './schemas/actress.schema'

@Module({
  providers: [VideoService],
  imports: [
    MongooseModule.forFeature([
      { name: Video.name, schema: VideoSchema },
      {
        name: Actress.name,
        schema: ActressSchema,
      },
    ]),
  ],
  controllers: [VideoController],
})
export class VideoModule {}
