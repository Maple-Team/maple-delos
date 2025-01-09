import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { tap } from 'rxjs/operators'
import { Observable } from 'rxjs'

/**
 * @description: 拦截器
 * 取巧处理刷新请求的响应头
 */
interface Token {
  accessToken?: string
  refreshToken?: string
}
@Injectable()
export class HeaderInterceptor implements NestInterceptor<AnyToFix, Token> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Token> {
    const req: Request = context.switchToHttp().getRequest()
    const url = req.url

    if (url.includes('/api/proxy')) {
      // 代理请求直接返回
      return next.handle()
    }

    return next.handle().pipe(
      tap((data) => {
        const res = context.switchToHttp().getResponse()

        if (url === '/api/auth/refresh') {
          //
        }
        // NOTE 适配刷新请求
        data?.refreshToken && res.header('X-Refresh-Token', data.refreshToken)
        data?.accessToken && res.header('X-Authorization', data.accessToken)
        res.header('X-Version', process.env.APP_VERSION)
      })
    )
  }
}
