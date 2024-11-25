import { ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../decorators'

@Injectable()
export class RefreshTokenGuard extends AuthGuard('refresh-token') {
  constructor(private reflector: Reflector, @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const url = request.url
    // 非刷新token的请求放行
    if (!url.includes('/auth/refresh')) return true

    return super.canActivate(context)
  }

  handleRequest(err: Error | null, user: AnyToFix | false, info, _context, status) {
    const msg = 'Invalid Refresh token'
    if (err) {
      this.logger.debug('RefreshTokenGuard error: %o, info: %o, status: %s', err, info, status)
      // 运行时发生异常
      throw new ForbiddenException(msg)
    }
    if (!user) {
      // 处理 user 为 null 的情况，可能是令牌格式错误或令牌过期
      this.logger.debug('RefreshTokenGuard error: %o, info: %o, status: %s', err, info, status)
      if (info && info.name === 'TokenExpiredError') throw new ForbiddenException(msg)

      throw new ForbiddenException(msg)
    }
    return user
  }
}
