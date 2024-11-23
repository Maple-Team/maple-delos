import { BadRequestException, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from '@/auth/decorators/public.decorator'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // 返回个class的函数
  constructor(private reflector: Reflector) {
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
    console.log('JwtAuthGuard handleRequest', status, info)
    if (err) {
      // 运行时发生异常
      throw new BadRequestException(err.message || 'JWT token error')
    }
    if (!user) {
      // 处理 user 为 null 的情况，可能是令牌格式错误或令牌过期
      if (info && info.name === 'TokenExpiredError') throw new UnauthorizedException('JWT token has expired')

      throw new UnauthorizedException('Invalid JWT token')
    }
    return user
  }
}
