import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { HttpStatus, Injectable } from '@nestjs/common'
import { map } from 'rxjs/operators'
import type { BaseResponse } from '@liutsing/types-utils'

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, BaseResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request: Request = context.switchToHttp().getRequest()
    const url = request.url

    if (['/api/auth/mqtt', '/api/proxy', '/api/screenshot'].includes(url)) {
      // mqtt 认证成功直接返回或者代理请求直接返回
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
