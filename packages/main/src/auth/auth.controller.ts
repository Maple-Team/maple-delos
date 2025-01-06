import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import type { Request as ExpressRequest } from 'express'
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { AuthService } from './auth.service'
import { Public } from './decorators'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RefreshTokenGuard } from './guards/refreshToken.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: ExpressRequest) {
    return req.user
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('logout')
  async logout(@Request() req: ExpressRequest) {
    await this.authService.logout(req.user.id)
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    const user = await this.authService.signIn(req.user)
    if (user instanceof BadRequestException) return user

    return user
  }

  /**
   * MQTT登录授权所需的路由
   *
   * 返回示例
HTTP/1.1 200 OK
Headers: Content-Type: application/json
...
Body:
{
    "result": "allow", // options: "allow" | "deny" | "ignore"
    "is_superuser": true // options: true | false, default value: false
}
   * @param req
   * @returns
   */
  @Public()
  @Post('mqtt')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async mqttLogin(@Request() req) {
    const user = await this.authService.signIn(req.user)
    if (user instanceof BadRequestException) return user

    return {
      result: 'allow',
      is_superuser: false,
    }
  }

  @UseGuards(RefreshTokenGuard, JwtAuthGuard)
  @Get('refresh')
  async refreshTokens(@Request() req) {
    // NOTE req.user: guard的validate函数的返回值
    const userId = req.user.sub
    const refreshToken = req.user.refreshToken
    const { refreshToken: newRefreshToken, accessToken } = await this.authService.refreshTokens(userId, refreshToken)
    return {
      accessToken,
      refreshToken: newRefreshToken,
    }
  }
}
