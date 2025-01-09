import { Controller, Get, Post, Request, Response } from '@nestjs/common'
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import { ProxyService } from './proxy.service'

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get()
  getFetch(@Request() req: ExpressRequest, @Response() res: ExpressResponse) {
    return this.proxyService.getFetch(req, res)
  }

  @Post()
  postFetch(@Request() req: ExpressRequest) {
    return this.proxyService.postFetch(req)
  }
}
