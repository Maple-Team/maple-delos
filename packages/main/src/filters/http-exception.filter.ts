import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Catch, HttpException, Inject } from '@nestjs/common'
import type { Request, Response } from 'express'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

// 自定义异常
// BadRequestException 错位的请求
// UnauthorizedException 未授权
// NotFoundException 未找到
// ForbiddenException 禁止访问
// NotAcceptableException    不可接受
// RequestTimeoutException   请求超时
// ConflictException   冲突
// GoneException      已被删除
// HttpVersionNotSupportedException   不支持的 HTTP 版本
// PayloadTooLargeException  负载太大
// UnsupportedMediaTypeException   不支持的媒体类型
// UnprocessableEntityException   无法处理的实体
// InternalServerErrorException   内部服务器错误
// NotImplementedException   未实现
// ImATeapotException   我是茶壶？
// MethodNotAllowedException   方法不允许
// BadGatewayException   网关错误
// ServiceUnavailableException   服务不可用
// GatewayTimeoutException   网关超时
// PreconditionFailedException   预条件失败
/**
 * @see HttpExceptionFilter
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()

    const exceptionRes = exception.getResponse()

    response
      .status(status)
      .header('X-Version', process.env.APP_VERSION)
      .json({
        status,
        timestamp: new Date().getTime(),
        path: request.url,
        message: exception.message,
        ...(typeof exceptionRes === 'string' ? { errors: [exceptionRes] } : exceptionRes),
      })
  }
}
