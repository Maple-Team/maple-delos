import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TimelineService } from './timeline.service'
import { Timeline, TimelineSchema } from './schemas/timeline.schema'
import { TimelineController } from './timeline.controller'

@Module({
  controllers: [TimelineController],
  providers: [TimelineService],
  imports: [MongooseModule.forFeature([{ name: Timeline.name, schema: TimelineSchema }])],
})
export class TimelineModule {}
