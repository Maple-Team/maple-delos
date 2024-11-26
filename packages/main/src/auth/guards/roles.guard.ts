import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRole } from '@liutsing/enums'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { Observable } from 'rxjs'
import { ROLES_KEY } from '@/auth/decorators/roles.decorator'
import { User } from '@/components/users/entities/user.entity'

// @reference: https://docs.nestjs.com/security/authorization: TODO 更多示例
// @https://medium.com/@rahulrulz680/manage-role-based-authorization-using-guards-in-nestjs-34b3be412e50
// @https://github.com/RahulFernando/nestjs-guards
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.debug('RolesGuard canActivate')
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles) return true
    // NOTE 需要先走jwt的守卫，req对象才会被注入user信息
    const { user }: { user: User | undefined } = context.switchToHttp().getRequest()
    this.logger.debug('role guard user', user)
    // FIXME user多个角色
    const result = requiredRoles.some((role) => user?.role === role)
    // false -> custom error message
    // false -> 框架内部抛出异常
    if (!result) throw new ForbiddenException('Forbidden resource')

    return true
  }
}
