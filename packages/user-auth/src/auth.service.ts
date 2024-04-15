import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { UserService } from 'src/components/users/user.service'
import { JwtService } from '@nestjs/jwt'
import { jwtConstants } from 'src/constants'
import * as bcrypt from 'bcrypt'
import { User } from 'src/components/users/entities/user.entity'
import { LoginUserDto } from 'src/components/users/dto/login-user.dto'
import { UserRole } from '@liutsing/enums'

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private usersService: UserService) {}
  //   https://github.com/lujakob/nestjs-realworld-example-app/blob/master/src/user/user.controller.ts
  async signIn(user: User) {
    if (!user) {
      return new BadRequestException()
    } else {
      const { ...result } = user
      const payload = { sub: user.id, username: user.username, role: user.role }

      const { refreshToken, accessToken } = await this.getTokens(payload)
      await this.updateRefreshToken(user.id, refreshToken)

      return {
        ...result,
        accessToken,
        refreshToken,
      }
    }
  }

  async validateUser(loginDto: LoginUserDto) {
    const user = await this.usersService.findOneByPhone(loginDto.phone)
    if (!user) throw new BadRequestException('用户名或密码错误')

    const res = await bcrypt.compare(loginDto.password, user?.password)
    if (res) {
      const { password: _password, ...result } = user
      return result
    } else {
      throw new BadRequestException('用户名或密码错误')
    }
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    await this.usersService.update(userId, {
      refreshToken,
    })
  }

  async getTokens(payload: { sub: number; username: string; role: UserRole }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: '30m',
      }),
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: '7d',
      }),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }

  async logout(userId: number) {
    return this.usersService.update(userId, { refreshToken: null })
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findOne(userId)
    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied')
    const refreshTokenMatches = user.refreshToken === refreshToken
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied')
    const tokens = await this.getTokens({ sub: user.id, username: user.username, role: user.role })
    await this.updateRefreshToken(user.id, tokens.refreshToken)
    return tokens
  }
}
