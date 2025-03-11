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
    this.logger.error(error) // NOTE 错误日志->console和文件的输出会有差别
    response.header('X-Version', process.env.APP_VERSION)

    // NOTE 策略模式
    if (error instanceof MongooseError) {
      response.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        // TODO 国际化
        message: error.message,
        timestamp: new Date().getTime(),
        path: request.url,
      })
    } else if (error instanceof SyntaxError || error instanceof TypeError || error instanceof RangeError) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        // message: error.message, // 屏蔽错误
        timestamp: new Date().getTime(),
        path: request.url,
      })
    } else {
      // TODO 补充错误类型
      const statusCode = HttpStatus.INTERNAL_SERVER_ERROR

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: statusCode,
        message: error.message,
        timestamp: new Date().getTime(),
        path: request.url,
      })
    }
  }
}
