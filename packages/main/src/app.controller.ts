import { Controller, Get, Inject, Query } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Observable } from 'rxjs'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('CALC_SERVICE') private calcClient: ClientProxy,
    @Inject('LOG_SERVICE') private logClient: ClientProxy
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('/test')
  calc(@Query('num') str): Observable<number> {
    const numArr = str.split(',').map((i) => parseInt(i))
    this.logClient.emit('log', `calc: ${numArr}`)
    return this.calcClient.send('sum', numArr)
  }
}
