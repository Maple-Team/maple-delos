import { Buffer } from 'buffer'
import { HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common'
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
    const { method, ip, originalUrl, headers, url, body: payload, statusCode } = req

    if (process.env.NODE_ENV === 'development') {
      const timestamp = Date.now()
      console.log(`Request URL: ${url} - ${originalUrl} - Timestamp: ${timestamp} - ${statusCode}`)
    }

    const info: RequestLogInfo = {
      method,
      ip,
      url: originalUrl,
      ua: headers['user-agent'],
      payload,
    }
    const rawSend = res.send
    // NOTE 重要的解决方案
    // NOTE 什么时候触发
    res.send = (body) => {
      if (!req.hasLogged) {
        // 在这里，你可以修改响应体，例如记录日志或进行其他操作
        // 政策法规下：请求体和响应体的信息不能够存储
        let status: number = HttpStatus.INTERNAL_SERVER_ERROR
        try {
          if (body instanceof Buffer) {
            status = HttpStatus.OK
          } else {
            // NOTE may be undefined
            // FIXME 优雅的处理这个响应状态
            status = JSON.parse(body).status
          }
          // 业务ok的请求，日志中的状态更新展示为200
          if (status === 0) status = 200
          if (status === undefined) status = HttpStatus.INTERNAL_SERVER_ERROR
        } catch (error) {
          this.logger.debug('error: %o', error)
        }
        const method = info.method.toUpperCase()
        const usedTime = performance.now() - t1
        // TODO 记录响应体
        method.toLowerCase() === 'get'
          ? this.logger.info(
              '%s %s %s %d %sms %s',
              method,
              `\x1b[34m${info.url}\x1b[0m`,
              info.ip,
              status,
              usedTime.toFixed(1),
              info.ua || 'N/A'
            )
          : this.logger.info(
              '%s %s %s %d %sms %s %o',
              method,
              `\x1b[34m${info.url}\x1b[0m`,
              info.ip,
              status,
              usedTime.toFixed(1),
              info.ua || 'N/A',
              info.payload
            )
        // 用户指纹 https://www.npmjs.com/package/@binance/fingerprint
        // https://www.npmjs.com/package/express-fingerprint
        // console.log(o.username, o.uid)
      }
      req.hasLogged = true
      // NOTE 调用原始的res.send()方法发送响应
      return rawSend.call(res, body)
    }
    // NOTE 作用
    next()
  }
}
