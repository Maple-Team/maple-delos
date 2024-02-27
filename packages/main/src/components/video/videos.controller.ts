import { Controller, Get, UseInterceptors } from '@nestjs/common'
import { Public } from '@/auth/decorators'
import { TransformInterceptor } from '@/interceptor/transform.interceptor'

@UseInterceptors(TransformInterceptor)
@Public()
@Controller('videos')
export class VideoController {
  @Get('all')
  findAllModuleUsers() {
    return []
  }
}
