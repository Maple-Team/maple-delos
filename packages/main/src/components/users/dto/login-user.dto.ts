import { IsNotEmpty } from 'class-validator'

export class LoginUserDto {
  @IsNotEmpty()
  readonly phone: string
  @IsNotEmpty()
  readonly password: string
}
