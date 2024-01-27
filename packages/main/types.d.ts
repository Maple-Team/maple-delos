import type { UserInfo } from '@liutsing/types-utils'

declare module 'express' {
  interface Request {
    user?: UserInfo
  }
}
declare interface ModifyUser extends User {
  isOnline?: boolean
}
