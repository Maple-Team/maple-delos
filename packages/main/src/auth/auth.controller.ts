import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import type { Request as ExpressRequest } from 'express'
import { AuthService } from './auth.service'
import { Public } from './decorators'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RefreshTokenGuard } from './guards/refreshToken.guard'
import { TransformInterceptor } from '@/interceptor/transform.interceptor'

@UseInterceptors(TransformInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
