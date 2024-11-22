import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Inject } from '@nestjs/common'
import { Request, Response } from 'express'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { QueryFailedError } from 'typeorm'
import { Logger } from 'winston'

/**
 * 捕获数据库错误，并返回给前端用户
 */
@Catch(QueryFailedError)
export class QueryFailedErrorFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}
  // NOTE https://docs.nestjs.com/exception-filters
  catch(err: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = HttpStatus.CONFLICT

    this.logger.error('error: %o, stack: %s, url: %s', err, err.stack, request.url)

    // TODO 预设映射关系，提供更好的提示信息，对应哪个用户可见字段
    // @ts-expect-error: xx
    if (err.code === 'ER_DUP_ENTRY') {
      // 从错误信息中提取出重复字段的信息
      const match = err.message.match(/Duplicate entry '(.*)' for key/)
      if (match && match.length > 1) {
        const duplicateValue = match[1]
        // 将重复字段的信息返回给前端用户
        response.status(status).json({
          message: `已存在相同的记录: ${duplicateValue}`,
          status,
          timestamp: new Date().toISOString(),
          path: request.url,
        })
        return
      }
    }

    response.status(status).json({
      message: '发生了数据库错误',
      status,
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}
