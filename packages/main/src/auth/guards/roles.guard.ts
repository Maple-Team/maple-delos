import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRole } from '@liutsing/enums'
import { ROLES_KEY } from '@/auth/decorators/roles.decorator'
import { User } from '@/components/users/entities/user.entity'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles) return true

    const { user }: { user: User } = context.switchToHttp().getRequest()
    return requiredRoles.some((role) => user.role === role)
  }
}
