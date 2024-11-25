import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { IS_PUBLIC_KEY } from '@/auth/decorators'

// 业务代码处打断点，然后查看调用栈，进而在三方库中的代码中打断点，查看执行流程
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // 返回个class的函数
  constructor(private reflector: Reflector, @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    return super.canActivate(context)
  }

  handleRequest(err: Error | null, user: AnyToFix | false, info, _context, status) {
    const msg = 'Invalid token'
    if (err) {
      this.logger.debug('JwtAuthGuard error: %o, info: %o, status: %s', err, info, status)
      // 运行时发生异常
      throw new UnauthorizedException(msg)
    }
    if (!user) {
      // 处理 user 为 null 的情况，可能是令牌格式错误或令牌过期
      this.logger.debug('JwtAuthGuard error: %o, info: %o, status: %s', err, info, status)
      if (info && info.name === 'TokenExpiredError') throw new UnauthorizedException(msg)

      throw new UnauthorizedException(msg)
    }
    return user
  }
}
