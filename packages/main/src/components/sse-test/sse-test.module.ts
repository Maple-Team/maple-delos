import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { SseTestController } from './sse-test.controller'

@Module({
  controllers: [SseTestController],
  imports: [EventEmitterModule.forRoot()],
})
export class SseTestModule {}
