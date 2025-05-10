import { Controller, Get, Post, Request, Response } from '@nestjs/common'
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import { ApiQuery, ApiResponse } from '@nestjs/swagger'
import { ProxyService } from './proxy.service'
import { ApiBaseResponse } from '@/swagger'

export enum ResponseType {
  arraybuffer = 'arraybuffer',
  blob = 'blob',
  text = 'text',
  stream = 'stream',
  document = 'document',
  json = 'json',
}

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get()
  @ApiQuery({ name: 'url', description: 'encodeURIComponent转义后的字符串' })
  @ApiQuery({
    name: 'responseType',
    description: 'axios支持的responseType，有json|text|arraybuffer|blob|stream|document',
    enum: ResponseType,
    example: 'json',
  })
  @ApiResponse({
    status: 200,
    type: ApiBaseResponse<AnyToFix>,
  })
  getFetch(@Request() req: ExpressRequest, @Response() res: ExpressResponse) {
    return this.proxyService.getFetch(req, res)
  }

  @Post()
  postFetch(@Request() req: ExpressRequest) {
    return this.proxyService.postFetch(req)
  }
}
