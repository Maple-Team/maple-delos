import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { BadRequestException, Injectable } from '@nestjs/common'
import { AuthService } from '../auth.service'
import { User } from '@/components/users/entities/user.entity'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // 构造函数传参去验证
    super({
      usernameField: 'phone',
      passwordField: 'password',
    })
  }

  // PassportStrategy中的抽象方法
  async validate(phone: string, password: string, _info): Promise<Partial<User>> {
    // console.log(_info) // function verified
    // if (!phone || !password) {
    //   // NOTE 字段不齐全会报错误 401，奇怪的错误码
    //   // FIXME 这里不生效
    //   throw new BadRequestException('手机号或密码为空')
    // }
    // 到了这里的代码，说明用户名和密码字段都不为空，接下来可以进行数据库查询等操作
    return this.authService.validateUser({ password, phone })
  }
}
