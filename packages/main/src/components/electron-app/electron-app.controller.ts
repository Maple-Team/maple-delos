import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { ElectronAppService } from './electron-app.service'
import { CreateElectronAppDto } from './dto/create-electron-app.dto'
import { UpdateElectronAppDto } from './dto/update-electron-app.dto'
import { Public } from '@/auth/decorators'

/**
路由匹配规则
静态路由：首先匹配完全匹配的静态路由，例如@Get('latest')。
参数路由：然后是包含参数的路由，例如@Get(':id')。
顺序：路由的声明顺序也会影响匹配结果，NestJS会按照你在控制器中声明它们的方式进行匹配。
 */
@Controller('electron-app')
export class ElectronAppController {
  constructor(private readonly electronAppService: ElectronAppService) {}

  @Public()
  @Post()
  create(@Body() createElectronAppDto: CreateElectronAppDto) {
    return this.electronAppService.create(createElectronAppDto)
  }

  @Public()
  @UseInterceptors(FilesInterceptor('app'))
  @Post('publish')
  publish(@Body() body, @UploadedFiles() app: Array<Express.Multer.File>) {
    console.log(body, app)
    return 200
  }

  @Get()
  findAll() {
    return this.electronAppService.findAll()
  }

  // 参考
  // const server = 'https://your-deployment-url.com'
  // const url = `${server}/update/${process.platform}/${app.getVersion()}`
  @Public()
  @Get('latest.yml')
  findLatest(@Query() params: { name: string; versionCode?: number }) {
    // TODO 参数判断
    if (!params.name) throw new BadRequestException('name参数不能为空')
    return this.electronAppService.findLatest(params)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.electronAppService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateElectronAppDto: UpdateElectronAppDto) {
    return this.electronAppService.update(+id, updateElectronAppDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.electronAppService.remove(+id)
  }
}
