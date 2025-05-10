import { Buffer } from 'buffer'
import { Controller, Get, HttpStatus, Inject, Post, Query, Response } from '@nestjs/common'
import type { Response as ExpressResponse } from 'express'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'

@Controller('screenshot')
export class PuppeteerController {
  constructor(@Inject('PUPPETEER_SERVICE') private puppeteerService: ClientProxy) {}

  // send： 发送消息并等待响应
  // emit： 发送消息但不等待响应

  @Post()
  async captureScreenshot(@Query('url') url: string, @Response() res: ExpressResponse) {
    if (!url) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'URL parameter is required',
      })
    }

    try {
      const task = await firstValueFrom(this.puppeteerService.send({ cmd: 'captureScreenshot' }, { url }))
      //   console.log(task)
      if (task.status === 'completed') {
        res
          .setHeader('Content-Type', 'image/png')
          .status(HttpStatus.OK)
          .send(Buffer.from(task.result.split(',')[1], 'base64'))
        return // 确保流程终止
      }
      res.status(HttpStatus.BAD_REQUEST).json({
        error: task.error || 'Unknown error',
      })
      //   return new BadRequestException(task.error)
    } catch (error) {
      console.error('Error generating screenshot:', error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : 'Internal server error',
      })
      //   return new BadRequestException(error)
    }
  }

  @Get('tasks')
  getActiveTasks() {
    return this.puppeteerService.send({ cmd: 'getActiveTasks' }, null)
  }
}
