import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import type { BaseList } from '@liutsing/types-utils'
import { sleep } from '@liutsing/utils'
import type { TimelineDocument } from './schemas/timeline.schema'
import { Timeline } from './schemas/timeline.schema'
import { CreateTimelineDto } from './dto/create-timeline.dto'

interface RestParams {
  type?: Timeline['type']
}
@Injectable()
export class TimelineService {
  constructor(@InjectModel(Timeline.name) private Model: Model<TimelineDocument>) {}

  async findWithPagination(page: number, pageSize: number, rest: RestParams): Promise<BaseList<Timeline>> {
    const filterKeys: RestParams = {}
    if (rest.type) filterKeys.type = rest.type

    const total = await this.Model.countDocuments({ ...filterKeys })

    const data = await this.Model.find({ ...filterKeys })
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
    return this.Model.findByIdAndDelete(id).exec()
  }

  create(createDto: CreateTimelineDto): Promise<Timeline> {
    const createdTask = new this.Model(createDto)
    return createdTask.save()
  }
}
