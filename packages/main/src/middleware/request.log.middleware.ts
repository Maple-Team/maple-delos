import { Inject, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import * as jwt from 'jsonwebtoken'
import { jwtConstants } from 'src/constants'

const MAX_LENGTH = 50
const IGNORE_PAYLOAD_METHODS = ['get', 'head', 'options']
@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, ip, body, originalUrl, headers } = req
    const token = (headers.authorization as string)?.split('Bearer ')?.[1]

    let info = {
      method,
      ip,
      originalUrl,
      ua: headers['user-agent'],
    }

    jwt.verify(token, jwtConstants.secret, (err, payload) => {
      if (!err) {
        const { username, sub } = payload
        info = {
          ...info,
          // @ts-expect-error: xx
          username,
          uid: sub,
        }
      }
    })

    if (!IGNORE_PAYLOAD_METHODS.includes(method.toLowerCase())) {
      const bodyStr = JSON.stringify(body)

      info['reqBody'] = bodyStr.length > MAX_LENGTH ? bodyStr.substring(0, MAX_LENGTH) : body
    }
    const rawSend = res.send
    // NOTE 重要的解决方案
    // @ts-expect-error: xx
    res.send = (body: string) => {
      // 在这里，你可以修改响应体，例如记录日志或进行其他操作
      try {
        this.logger.info({ ...info, resBody: JSON.parse(body) })
      } catch (error) {}
      // 调用原始的res.send()方法发送响应
      rawSend.call(res, body)
    }

    next()
  }
}
