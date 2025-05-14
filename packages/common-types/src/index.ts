import type { JwtPayload as JwtPayloadBase } from 'jsonwebtoken'
import type { UserRole } from '@liutsing/enums'

export * from './apk'
export * from './ipa'
export * from './syz'

export type JwtPayload = Omit<JwtPayloadBase, 'sub'> & {
  sub: number
  username: string
  role: UserRole
  env: string
  tokenType: 'refresh' | 'access'
}
