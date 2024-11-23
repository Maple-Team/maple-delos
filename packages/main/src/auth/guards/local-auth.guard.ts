import { HttpException, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  /**
   * 认证后的结果回调
   * @param err 认证过程中抛出的错误
   * @param user 认证成功后的用户信息
   * @param info 认证过程中的信息
   * @param _context 认证相关的请求信息
   * @param status 认证过程中的状态码
   * @returns
   */
  handleRequest(err: Error | null, user: AnyToFix | false, info, _context, status: number) {
    console.log('LocalAuthGuard handleRequest: ', err, user, info, status)
    if (err) throw err // 认证过程中抛出的错误

    if (!user) {
      // 处理 user 为 null 的情况，可能是令牌格式错误或令牌过期
      //   if (info && info.name === 'TokenExpiredError') throw new UnauthorizedException('JWT token has expired')
      throw new HttpException(info, status)
    }
    return user
  }
}
