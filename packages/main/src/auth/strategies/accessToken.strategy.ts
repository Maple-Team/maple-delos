import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { jwtConstants } from '@/constants'
import { UserService } from '@/components/users/user.service'

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UserService) {
    // 构造函数传参去验证
    super({
      // Function that accepts a request as the only parameter and returns the either JWT as a string or null
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // if true do not validate the expiration of the token.
      ignoreExpiration: false,
      //  String or buffer containing the secret or PEM-encoded public key. Required unless secretOrKeyProvider is provided.
      secretOrKey: jwtConstants.secretKey,
    })
  }

  // Pass the parsed token to the user
  /**
   * @param payload
   * @param _verified
   * @returns 返回给request.user对象
   */
  async validate(payload: AnyToFix, _verified: Function) {
    return this.usersService.findOne(payload.sub)
  }
}
