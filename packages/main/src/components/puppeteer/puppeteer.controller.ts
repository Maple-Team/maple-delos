import { Buffer } from 'buffer'
import { Controller, Get, HttpStatus, Post, Query, Response } from '@nestjs/common'
import type { Response as ExpressResponse } from 'express'
import { PuppeteerService } from './puppeteer.service'

@Controller('screenshot')
export class PuppeteerController {
  constructor(private readonly puppeteerService: PuppeteerService) {}

  @Post()
  async captureScreenshot(@Query('url') url: string, @Response() res: ExpressResponse) {
    if (!url) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'URL parameter is required',
      })
    }

    try {
      const task = await this.puppeteerService.generateScreenshot(url)
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
  getActiveTasks(): AnyToFix[] {
    return this.puppeteerService.getActiveTasks()
  }
}
