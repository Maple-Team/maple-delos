import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { map } from 'rxjs/operators'
import type { BaseResponse } from '@liutsing/types-utils'
import { StatusEnum } from '@/enum/status'

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, BaseResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler) {
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
