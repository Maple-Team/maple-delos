import { Inject, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import * as jwt from 'jsonwebtoken'
import { jwtConstants } from 'src/constants'

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, ip, body, originalUrl, headers } = req
    const token = (headers.authorization as string)?.split('Bearer ')?.[1]
    jwt.verify(token, jwtConstants.secret, (err, payload) => {
      if (method.toLowerCase() === 'get') return
      let info = {
        method,
        ip,
        body,
        originalUrl,
        ua: headers['user-agent'],
      }
      if (!err) {
        const { username, sub } = payload
        info = {
          ...info,
          // @ts-expect-error: xx
          username,
          uid: sub,
        }
      }
      this.logger.info(info)
    })

    next()
  }
}
