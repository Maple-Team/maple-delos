import { HttpException, Inject, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {
    super({
      badRequestMessage: '手机号或密码为空',
    })
  }

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
    if (err) throw err // 认证过程中抛出的错误

    if (!user) {
      this.logger.error('LocalAuthGuard handleRequest: ', err, user, info, status)
      // 认证过程中没有抛出错误，但是认证失败
      throw new HttpException(info, status)
    }
    return user
  }
}
