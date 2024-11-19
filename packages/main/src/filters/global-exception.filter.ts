import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject } from '@nestjs/common'
import { Response } from 'express'
import { MongooseError } from 'mongoose'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { QueryFailedError } from 'typeorm'
import { Logger } from 'winston'

/**
 * 统一的异常处理
 */
@Catch(Error)
export class GlobalErrorFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    // // @ts-expect-error: 确定类型原型
    // // eslint-disable-next-line no-proto
    // console.log('[ error type ] >', error.__proto__)
    this.logger.error('error: %o, stack: %s, url: %s', error, error.stack, request.url)
    // NOTE 策略模式
    if (error instanceof HttpException) {
      const status = error.getStatus()
      response.status(status).json({
        status,
        message: error.message,
      })
    } else if (error instanceof MongooseError) {
      response.status(400).json({
        status: HttpStatus.BAD_REQUEST,
        // TODO 国际化
        message: error.message,
      })
    } else if (error instanceof QueryFailedError) {
      const status = HttpStatus.CONFLICT
      // TODO 预设映射关系，提供更好的提示信息，对应哪个用户可见字段
      // @ts-expect-error: xx
      if (err.code === 'ER_DUP_ENTRY') {
        // 从错误信息中提取出重复字段的信息
        const match = error.message.match(/Duplicate entry '(.*)' for key/)
        if (match && match.length > 1) {
          const duplicateValue = match[1]
          // 将重复字段的信息返回给前端用户
          response.status(status).json({
            message: `已存在相同的记录: ${duplicateValue}`,
            status,
          })
          return
        }
      }

      response.status(status).json({
        message: '发生了数据库错误',
        status,
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
