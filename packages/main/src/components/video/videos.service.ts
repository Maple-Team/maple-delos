import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import type { BaseList } from '@liutsing/types-utils'
import type { VideoDocument } from './schemas/video.schema'
import { Video } from './schemas/video.schema'

interface RestParams {
  code?: Video['code'] 
  actress?: string | AnyToFix
}
@Injectable()
export class VideoService {
  constructor(@InjectModel(Video.name) private model: Model<VideoDocument>) {}

  async add(data: Partial<Video>) {
    const res = await this.model.findOneAndUpdate({ code: data.code }, data).exec()
    if (res) return res
    return (await this.model.create({ ...data, waiting: true })).save()
  }

  async findAll() {
    return this.model
      .find({ waiting: { $ne: true } })
      .select('code')
      .exec()
  }

  async findWithPagination(page: number, pageSize: number, rest: RestParams): Promise<BaseList<Video>> {
    const filterKeys: RestParams = {}
    if (rest.code) filterKeys.code = rest.code
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
