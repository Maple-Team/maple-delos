import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { HttpStatus, Injectable } from '@nestjs/common'
import { map } from 'rxjs/operators'
import type { BaseResponse } from '@liutsing/types-utils'

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, BaseResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request: Request = context.switchToHttp().getRequest()
    const url = request.url

    if (['/api/auth/mqtt', '/api/proxy', '/api/screenshot'].some((u) => url.includes(u))) {
      // NOTE 响应体为buffer或其他特殊目的的请求直接返回
      return next.handle()
    }

    return next.handle().pipe(
      map((data) => {
        return {
          status: HttpStatus.OK,
          message: 'success',
          data,
          timestamp: new Date().getTime(),
        }
      })
    )
  }
}
