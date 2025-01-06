import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UserModule } from '@/components/users/user.module'
import { AccessTokenStrategy } from '@/auth/strategies/accessToken.strategy'
import { RefreshTokenStrategy } from '@/auth/strategies/refreshToken.strategy'
import { LocalStrategy } from '@/auth/strategies/local.strategy'
// import { APP_GUARD } from '@nestjs/core'
// import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'
// import { RefreshTokenGuard } from '@/auth/guards/refreshToken.guard'
// import { RolesGuard } from '@/auth/guards/roles.guard'
import { AuthController } from '@/auth/auth.controller'
import { AuthService } from '@/auth/auth.service'

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    // 注册为全局的守卫
    // NOTE 暂时禁用全局的方式
    // {
    //   provide: APP_GUARD,
    //   useClass: RefreshTokenGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
  exports: [AuthService],
})
export class AuthModule {}
