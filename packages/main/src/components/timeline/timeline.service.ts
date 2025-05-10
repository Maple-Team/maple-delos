import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import type { BaseList } from '@liutsing/types-utils'
import type { TimelineDocument } from './schemas/timeline.schema'
import { Timeline } from './schemas/timeline.schema'
import { CreateTimelineDto } from './dto/create-timeline.dto'
import { UpdateTimelineDto } from './dto/update-timeline.dto'

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

    const query = this.Model.find({ ...filterKeys })
    const data = await query
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ created_at: 'desc' })
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

  deleteById(id: string) {
    return this.Model.findByIdAndDelete(id).exec()
  }

  findById(id: string) {
    return this.Model.findById(id).exec()
  }

  create(createDto: CreateTimelineDto): Promise<Timeline> {
    const createdTask = new this.Model(createDto)
    return createdTask.save()
  }

  update(id: string, updateDto: UpdateTimelineDto) {
    return this.Model.findByIdAndUpdate(id, updateDto, { new: true }).exec()
  }
}
