import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject } from '@nestjs/common'
import { Response } from 'express'
import { MongooseError } from 'mongoose'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

/**
 * 未捕捉到的错误，统一返回只错误码
 */
@Catch(Error)
export class GlobalErrorFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    // @ts-expect-error: 确定类型原型
    // eslint-disable-next-line no-proto
    console.error('[ error type ] >', error.__proto__)
    if (error instanceof HttpException) {
      const status = error.getStatus()
      response.status(status).json({
        status,
        message: error.message,
      })
    } else if (error instanceof MongooseError) {
      console.error(error)
      response.status(400).json({
        status: 400,
        // TODO 国际化
        message: error.message,
      })
    } else {
      try {
        // @ts-expect-error: xx
        const statusCode = error.statusCode
        const msg = { code: statusCode, stack: error.stack }
        // this.logger.error(msg)
        console.error(msg)
        response.status(statusCode).send()
      } catch (e) {
        // this.logger.error({ stack: e.stack })
        // @ts-expect-error:xx
        console.error({ stack: e.stack })
        response.status(400).send()
      }
    }
  }
}
