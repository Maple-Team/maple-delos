import { Inject, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

declare module 'express' {
  interface Request {
    /**
     * 请求日志中间件
     */
    hasLogged?: boolean
  }
}

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    // FIXME 输出两次？
    const t1 = performance.now()
    const { method, ip, originalUrl, headers } = req

    // console.log('headers: ', headers.authorization, originalUrl)

    const info: RequestLogInfo = {
      method,
      ip,
      url: originalUrl,
      ua: headers['user-agent'],
    }

    const rawSend = res.send
    // NOTE 重要的解决方案
    res.send = (body) => {
      if (!req.hasLogged) {
        // 在这里，你可以修改响应体，例如记录日志或进行其他操作
        // 政策法规下：请求体和响应体的信息不能够存储
        let status
        try {
          status = JSON.parse(body).status
        } catch (error) {
          // 空body导致的错误
          // controller层没有使用@UseInterceptors(TransformInterceptor)
          this.logger.error('body error: %o', error)
        }
        const method = info.method.toUpperCase()
        const usedTime = performance.now() - t1

        // 记录请求日志
        this.logger.info(
          '%s %s %s %d %sms %s',

          method,
          `\x1b[34m${info.url}\x1b[0m`,
          info.ip,
          status,
          usedTime.toFixed(1),
          info.ua
        )
        // 用户指纹 https://www.npmjs.com/package/@binance/fingerprint
        // https://www.npmjs.com/package/express-fingerprint
        // console.log(o.username, o.uid)
        req.hasLogged = true
      }

      // NOTE 调用原始的res.send()方法发送响应
      return rawSend.call(res, body)
    }

    next()
  }
}
