import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import type { Request as ExpressRequest } from 'express'
import { AuthService } from './auth.service'
import { Public } from './decorators/public.decorator'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { RefreshTokenGuard } from './guards/refreshToken.guard'
import { TransformInterceptor } from '@/interceptor/transform.interceptor'

@UseInterceptors(TransformInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    const user = await this.authService.signIn(req.user)
    if (user instanceof BadRequestException) return user

    return user
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    delete req.user.refreshToken
    return req.user
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('logout')
  async logout(@Request() req: ExpressRequest) {
    await this.authService.logout(req.user.id)
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Request() req) {
    const userId = req.user.sub
    const refreshToken = req.user.refreshToken
    const { refreshToken: newRefreshToken, accessToken } = await this.authService.refreshTokens(userId, refreshToken)
    return {
      accessToken,
      refreshToken: newRefreshToken,
    }
  }
}
