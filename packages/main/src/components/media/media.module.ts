import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MediaService } from './media.service'
import { MediaController } from './media.controller'
import { Media, MediaSchema } from './schemas/media.schema'

@Module({
  providers: [MediaService],
  controllers: [MediaController],
  imports: [MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }])],
})
export class MediaModule {}
