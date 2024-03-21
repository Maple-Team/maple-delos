import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import type { BaseList } from '@liutsing/types-utils'
import type { VideoDocument } from './schemas/video.schema'
import { Video } from './schemas/video.schema'

interface RestParams {
  no?: Video['no']
  actress?: string | AnyToFix
}
@Injectable()
export class VideoService {
  async findAll() {
    return await this.model.find({}).select('no').exec()
  }

  constructor(@InjectModel(Video.name) private model: Model<VideoDocument>) {}

  async findWithPagination(page: number, pageSize: number, rest: RestParams): Promise<BaseList<Video>> {
    const filterKeys: RestParams = {}
    if (rest.no) filterKeys.no = rest.no
    if (rest.actress) {
      filterKeys.actress = {
        $elemMatch: {
          name: filterKeys.actress,
        },
      }
    }

    const total = await this.model.find({ ...filterKeys }).count()

    const data = await this.model
      .find({
        ...filterKeys,
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ ts: -1 })
      .exec()

    return {
      pagination: {
        total,
        current: +page,
        pageSize,
      },
      records: data,
    }
  }
}
