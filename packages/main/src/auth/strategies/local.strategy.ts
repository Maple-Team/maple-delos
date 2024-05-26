import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { BadRequestException, Injectable } from '@nestjs/common'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'phone' })
  }

  async validate(phone: string, password: string): Promise<any> {
    if (!phone || !password) {
      // NOTE 字段不齐全会报错误 401，奇怪的错误码
      // FIXME 这里不生效
      throw new BadRequestException('手机号或密码为空')
    }
    return this.authService.validateUser({ password, phone })
  }
}
