import { Controller, Sse } from '@nestjs/common'
import { Observable, interval, map } from 'rxjs'
import { Public } from '../../auth/decorators/public.decorator'

// https://docs.nestjs.com/techniques/server-sent-events
@Controller('sse-test')
@Public()
export class SseTestController {
  @Sse('sse')
  sse(): Observable<MessageEvent> {
    // rxJS处理响应结束
    return interval(1000).pipe(map((_) => ({ data: { hello: 'world' } } as MessageEvent)))
  }
}
