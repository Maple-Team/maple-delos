import { Controller, Get, Sse } from '@nestjs/common'
import { Observable, fromEvent, interval, map } from 'rxjs'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Public } from '../../auth/decorators/public.decorator'

// https://docs.nestjs.com/techniques/server-sent-events
@Controller('sse-test')
@Public()
export class SseTestController {
  constructor(private eventEmitter: EventEmitter2) {}

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    // rxJS处理响应结束
    return interval(1000).pipe(map((_) => ({ data: { hello: 'world' } } as MessageEvent)))
  }

  @Sse('sse2')
  sse2(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'test-order').pipe(
      map((data) => {
        // NOTE 客户端匹配消息type名称
        return new MessageEvent('test-order', { data })
      })
    )
  }

  @Get('/emit')
  emit() {
    this.eventEmitter.emit('test-order', { no: 123 })
    return { result: 'ok', ts: new Date().valueOf() }
  }
}
