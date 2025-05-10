import { resolve } from 'path'
import { BaseResponse } from '@liutsing/types-utils'
import { ApiProperty, DocumentBuilder, SwaggerCustomOptions, SwaggerDocumentOptions } from '@nestjs/swagger'

const root = resolve(__dirname, '..', '..')

export class ApiBaseResponse<T> implements BaseResponse<T> {
  @ApiProperty({
    description: '状态码',
    example: 200,
  })
  status: number

  @ApiProperty({
    description: '接口状态消息',
    example: 'success',
  })
  message: string

  @ApiProperty({
    description: '接口返回的泛型数据',
    example: '{}',
  })
  data: T

  @ApiProperty({
    description: '接口返回的时间戳',
    example: 1677721600000,
  })
  timestamp: number
}
// Swagger配置
export const swaggerConfig = new DocumentBuilder()
  .setTitle('MapleImage')
  .setDescription('The maple admin API description')
  .setVersion(require(`${root}/package.json`).version)
  .build()

export const swaggerOptions: SwaggerCustomOptions = {
  useGlobalPrefix: true,
  // swagger api json: http://localhost:4003/api/swagger/json
  jsonDocumentUrl: 'swagger/json',
}
export const swaggerDocumentOptions: SwaggerDocumentOptions = {}
