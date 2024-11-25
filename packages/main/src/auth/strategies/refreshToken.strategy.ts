import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { Injectable } from '@nestjs/common'
import { jwtConstants } from '@/constants'

/**
 * jwt策略
 */
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      // If true the verify callback will be called with args (request, jwt_payload, done_callback)
      passReqToCallback: true, // 回调带request对象
      // Function that accepts a request as the only parameter and returns the either JWT as a string or null
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // if true do not validate the expiration of the token.
      ignoreExpiration: false,
      //  String or buffer containing the secret or PEM-encoded public key. Required unless secretOrKeyProvider is provided.
      secretOrKey: jwtConstants.secretKey,
    })
  }

  /**
   *
   * @param req 原始的请求
   * @param payload jwt解析后的payload
   * @returns 返回给request.user对象
   */
  validate(req: Request, payload: AnyToFix) {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim()
    const refreshResult = { ...payload, refreshToken }
    return refreshResult
  }
}
