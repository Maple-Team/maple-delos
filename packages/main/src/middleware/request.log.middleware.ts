import { Buffer } from 'buffer'
import { HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import type { JwtPayload } from '@liutsing/types'

declare module 'express' {
  interface Request {
    /**
     * 请求日志中间件
     */
    hasLogged?: boolean
  }
}

class ReqUser {
  id: number
  username: string
  phone: string
  constructor(id?: number, username?: string, phone?: string) {
    this.id = id
    this.username = username
    this.phone = phone
  }

  toString() {
    if (!this.id) return 'N/A'
    return `${this.id}/${this.username ?? ''}/${this.phone ?? '0'}`
  }
}

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    // FIXME 输出两次？
    const t1 = performance.now()
    const { method, ip, originalUrl, headers, body: payload } = req

    if (process.env.NODE_ENV === 'development') {
      //   const timestamp = Date.now()
      //   console.log(`Request URL: ${url} - ${originalUrl} - Timestamp: ${timestamp} - ${statusCode}`)
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
          } else if (body instanceof Error) {
            // 其他异常
            status = HttpStatus.INTERNAL_SERVER_ERROR
          } else if (typeof body === 'string') {
            status = JSON.parse(body).status
          } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR
          }
        } catch (error) {
          // FIXME 存在未处理的响应状态
          this.logger.debug('status error: %o, url: %s', error, originalUrl)
        }
        // 404 接口无用户信息：未走到鉴权中间件
        const authorization = headers.authorization
        const token = authorization?.split('.')[1]
        const jwtPayload: JwtPayload | undefined = token
          ? (JSON.parse(Buffer.from(token, 'base64').toString()) as unknown as JwtPayload)
          : undefined

        // FIXME /api/auth/login 172.18.0.1 200 48.9ms { phone: '18123845936', password: '5936' } 1 Admin/undefined
        const method = info.method.toUpperCase()
        const usedTime = performance.now() - t1
        const infoUser = new ReqUser(
          req.user?.id ?? jwtPayload?.sub,
          req.user?.username ?? jwtPayload?.username,
          req.user?.phone
        )

        // TODO 记录响应体
        method.toLowerCase() === 'get'
          ? this.logger.info(
              ' %s %s %s %d %sms %s %s',
              method,
              `\x1b[34m${info.url}\x1b[0m`,
              info.ip,
              status,
              usedTime.toFixed(1),
              info.ua,
              infoUser
            )
          : this.logger.info(
              '%s %s %s %d %sms %s %s %o',
              method,
              `\x1b[34m${info.url}\x1b[0m`,
              info.ip,
              status,
              usedTime.toFixed(1),
              info.ua,
              infoUser,
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
