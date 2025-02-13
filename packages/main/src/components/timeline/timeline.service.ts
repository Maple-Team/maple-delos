import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import type { BaseList } from '@liutsing/types-utils'
import { sleep } from '@liutsing/utils'
import type { TimelineDocument } from './schemas/timeline.schema'
import { Timeline } from './schemas/timeline.schema'

interface RestParams {
  type?: Timeline['type']
}
@Injectable()
export class TimelineService {
  constructor(@InjectModel(Timeline.name) private model: Model<TimelineDocument>) {}

  async findWithPagination(page: number, pageSize: number, rest: RestParams): Promise<BaseList<Timeline>> {
    const filterKeys: RestParams = {}
    if (rest.type) filterKeys.type = rest.type

    const total = await this.model.find({ ...filterKeys }).count()

    const data = await this.model
      .find({ ...filterKeys })
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

  async deleteById(id: string) {
    await sleep(1000 * 5)
    // if (Math.random() > 0.5) throw new Error('删除失败')
    return this.model.findByIdAndDelete(id).exec()
  }
}
