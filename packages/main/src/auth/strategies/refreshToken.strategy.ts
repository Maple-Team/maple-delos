import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { Injectable } from '@nestjs/common'
import { jwtConstants } from '@/constants'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secretKey,
      passReqToCallback: true,
    })
  }

  validate(req: Request, payload: AnyToFix) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim()
    console.log('refreshToken', refreshToken)
    return { ...payload, refreshToken }
  }
}
