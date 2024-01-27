import { IsNotEmpty } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  readonly username: string

  @IsNotEmpty()
  readonly phone: string

  @IsNotEmpty()
  readonly password: string

  @IsNotEmpty()
  readonly staffId: string

  readonly avatar: string

  readonly refreshToken: string
}
