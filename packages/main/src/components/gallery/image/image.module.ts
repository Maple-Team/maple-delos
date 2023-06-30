import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ImageService } from './image.service'
import { ImageController } from './image.controller'
import { Image } from './entities/image.entity'

@Module({
  controllers: [ImageController],
  providers: [ImageService],
  imports: [TypeOrmModule.forFeature([Image])],
})
export class ImageModule {}
