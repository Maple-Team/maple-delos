import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { tap } from 'rxjs/operators'
import { Observable } from 'rxjs'

@Injectable()
export class HeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<AnyToFix> {
    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse()
        res.header('X-Version', process.env.APP_VERSION)
      })
    )
  }
}
