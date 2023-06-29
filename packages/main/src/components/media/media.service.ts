import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { MediaDocument } from './schemas/media.schema'
import { Media } from './schemas/media.schema'
import type { CreateMediaDto } from './dto/create-media.dto'

@Injectable()
export class MediaService {
  constructor(@InjectModel(Media.name) private MediaModel: Model<MediaDocument>) {}

  async create(createMediaDto: CreateMediaDto): Promise<Media> {
    const createdMedia = new this.MediaModel(createMediaDto)
    return createdMedia.save()
  }

  async findAll(): Promise<Media[]> {
    return this.MediaModel.find().exec()
  }
}
