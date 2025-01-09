import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { map } from 'rxjs/operators'
import type { BaseResponse } from '@liutsing/types-utils'
import { StatusEnum } from '@/enum/status'

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, BaseResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request: Request = context.switchToHttp().getRequest()
    const url = request.url

    if (url.includes('/api/auth/mqtt') || url.includes('/api/proxy')) {
      // mqtt 认证成功直接返回或者代理请求直接返回
      return next.handle()
    }

    return next.handle().pipe(
      map((data) => {
        return {
          status: StatusEnum.OK,
          message: 'success',
          data,
          timestamp: new Date().getTime(),
        }
      })
    )
  }
}
