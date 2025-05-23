import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import bcrypt from 'bcrypt'
import { UserRole } from '@liutsing/enums'
import { sleep } from '@liutsing/utils'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { UserService } from '@/components/users/user.service'
import { jwtConstants } from '@/constants'
import { User } from '@/components/users/entities/user.entity'
import { LoginUserDto } from '@/components/users/dto/login-user.dto'

/**
 * 用户认证服务
 */
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  //   https://github.com/lujakob/nestjs-realworld-example-app/blob/master/@/user/user.controller.ts
  async signIn(user: User) {
    if (!user) {
      return new BadRequestException()
    } else {
      const { ...result } = user
      const payload = { sub: user.id, username: user.username, role: user.role }

      const { refreshToken, accessToken } = await this.getTokens(payload, null)
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

  /**
   * 生成token
   * 如果已存在刷新token，则使用已存在的刷新token
   * @param payload
   * @param existedRefreshToken
   * @returns
   */
  async getTokens(payload: { sub: number; username: string; role: UserRole }, existedRefreshToken: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.secretKey,
        expiresIn: jwtConstants.accessTokenExpiresIn,
      }),
      !existedRefreshToken
        ? this.jwtService.signAsync(payload, {
            secret: jwtConstants.secretKey,
            expiresIn: jwtConstants.refreshTokenExpiresIn,
          })
        : sleep(100),
    ])

    return {
      accessToken,
      refreshToken: (refreshToken as string | undefined) || existedRefreshToken,
    }
  }

  async logout(userId: number) {
    // TODO 失效 accessToken
    return this.usersService.update(userId, { refreshToken: null })
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findOne(userId)
    if (!user || !user.refreshToken) throw new ForbiddenException('Invalid user')
    const refreshTokenMatches = user.refreshToken === refreshToken
    if (!refreshTokenMatches) throw new ForbiddenException('Invalid refresh token')
    const tokens = await this.getTokens({ sub: user.id, username: user.username, role: user.role }, user.refreshToken)
    await this.updateRefreshToken(user.id, tokens.refreshToken)
    return tokens
  }
}
