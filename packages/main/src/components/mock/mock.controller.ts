import { Controller, Get, Inject, Param } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

@Controller('mock')
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
