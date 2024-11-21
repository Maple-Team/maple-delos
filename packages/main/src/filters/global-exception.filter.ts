import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Inject } from '@nestjs/common'
import { Response } from 'express'
import { MongooseError } from 'mongoose'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

/**
 * 统一的异常处理
 * @reference https://docs.nestjs.com/exception-filters
 */
@Catch()
// CatchEverythingFilter
export class GlobalErrorFilter implements ExceptionFilter {
  // constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  // httpAdapter适配express和fastify
  // httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    this.logger.error('error: %o, stack: %s, url: %s', error, error.stack, request.url)
    // NOTE 策略模式
    if (error instanceof MongooseError) {
      response.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        // TODO 国际化
        message: error.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      })
    } else {
      try {
        // @ts-expect-error: xx
        const statusCode = error.statusCode
        response.status(statusCode).send()
      } catch (e) {
        response.status(HttpStatus.BAD_REQUEST).send(e)
      }
    }
  }
}
