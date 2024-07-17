import { createWriteStream } from 'node:fs'
import { resolve } from 'node:path'
import * as crypto from 'crypto'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { TransformInterceptor } from 'src/interceptor/transform.interceptor'
import { UserRole } from '@liutsing/enums'
import { BaseParams, ChangePwdDto } from '@liutsing/types-utils'
import { FileInterceptor } from '@nestjs/platform-express'
import { mkdirSafeSync } from '@liutsing/node-utils'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import type { Request as ExpressRequest } from 'express'
import type { UpdateResult } from 'typeorm'
import { Roles } from '../../auth/decorators'
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UserService } from './user.service'

@UseInterceptors(TransformInterceptor)
@Roles(UserRole.ADMIN)
@Controller('users')
export class UserController {
  constructor(
    private readonly service: UserService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Post()
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('avatar'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createUserDto: CreateUserDto) {
    const res = await this.service.create(createUserDto)
    file && this.upload(file, res.id)
    return res
  }

  async upload(file: Express.Multer.File, id: number) {
    const date = new Date()
    const prefix = `${date.getFullYear()}/${date.getMonth() + 1}${date.getDate()}`
    const uploadDir = resolve(process.cwd(), `./uploads/${prefix}`)
    mkdirSafeSync(uploadDir, { recursive: true })
    const filenameArr = file.originalname.split('.')
    const extArray = file.mimetype.split('/')
    const ext = extArray[extArray.length - 1]
    filenameArr.pop()
    const filename = `${crypto.createHash('md5').update(filenameArr.join('')).digest('hex')}.${ext}`

    const path = `${uploadDir}/${filename}`
    const writeStream = createWriteStream(path)
    writeStream.write(file.buffer, (e) => {
      if (e) {
        throw e
      } else {
        this.service.update(id, { avatar: `/${prefix}/${filename}` }).catch(console.error)
        writeStream.end()
      }
    })
  }

  @Get('devices')
  findAllModuleUsers() {
    return this.service.findAllModuleUsers()
  }

  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.usersService.findOne(+id)
  //   }

  @HttpCode(200)
  @Roles(UserRole.USER, UserRole.DEVICE, UserRole.ADMIN)
  @Post('changePwd')
  changePwd(@Body() data: ChangePwdDto, @Request() req: ExpressRequest): Promise<UpdateResult> {
    return this.service.changePwd(data, +req.user.id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id)
  }

  @Get()
  findWithPagination(@Query() query) {
    const { current = 1, pageSize = 10, ...rest } = query as BaseParams<User>
    return this.service.findMany({
      current: +current,
      pageSize: +pageSize,
      ...rest,
    })
  }

  @Put(':id')
  async resetPwd(@Param('id') id: string) {
    return this.service.resetPwd(+id)
  }

  @Get(':id/logs')
  @Roles(UserRole.USER, UserRole.ADMIN)
  logs(@Param('id') id: string) {
    return this.service.logs(+id)
  }

  @Get(':id/accessory')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async accessoryGroupBy(@Param('id') id: string) {
    const data = await this.service.accessoryGroupBy(+id)
    return data.map(({ count, ...rest }) => ({ count: +count, ...rest })).filter(({ count }) => count > 0)
  }

  @Get('stats')
  async userStats() {
    const data = await this.service.userStats()
    return data
      .map(({ count, users_id, users_user_name }) => ({ count: +count, userId: users_id, userName: users_user_name }))
      .filter(({ count }) => count > 0)
  }

  @HttpCode(200)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @Get('menus')
  getMenu() {
    // TODO 从数据库中读取
    return ['/dashboard', '/react-demo', '/react-amap', '/react-panel', '/graphql', '/socket-io-chat']
  }

  @Roles(UserRole.USER, UserRole.ADMIN)
  @Get('data-permission')
  getDataPermission(@Query() query) {
    const id = +query.id
    if (id > 0.5) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)

    // TODO 从数据库中读取
    return ['/dashboard', '/react-demo', '/react-amap', '/react-panel', '/graphql', '/socket-io-chat']
  }
}
