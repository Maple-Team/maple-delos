import { CACHE_MANAGER, Controller, Get, Inject, Param, UseInterceptors } from '@nestjs/common'
import { TransformInterceptor } from 'src/interceptor/transform.interceptor'
import { Cache } from 'cache-manager'

@Controller('mock')
@UseInterceptors(TransformInterceptor)
export class MockController {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  @Get('/:url')
  async wildcard(@Param() { url }: { url: string }) {
    const cachedData = await this.cacheService.get(url)
    console.log({ cachedData, url })
    return cachedData
  }

  @Get('/test')
  test(@Param() url: string) {
    return url
  }
}
