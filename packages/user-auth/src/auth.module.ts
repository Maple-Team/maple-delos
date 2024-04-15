import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'  
import { PassportModule } from '@nestjs/passport' 

@Module({
  imports: [ 
    PassportModule,
    JwtModule.register({
      //   global: false,
      //   secret: jwtConstants.secret,
      //   signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
