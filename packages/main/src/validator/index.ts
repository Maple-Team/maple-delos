import { BadRequestException, ValidationPipe } from '@nestjs/common'

export const validationPipe = new ValidationPipe({
  whitelist: true, // 去除所有不在验证白名单上的属性
  forbidNonWhitelisted: false, // true: 如果存在不在验证白名单上的属性，则抛出错误，这可以防止客户端发送额外的字段，从而增强数据的安全性
  transform: true, //  会自动将请求体中的数据转换为 DTO 类的实例
  transformOptions: {
    // NOTE 允许自定义 class-transformer 的行为
    enableImplicitConversion: true, // 启用隐式转换
    excludePrefixes: ['_'], // 排除以 _ 开头的字段
    exposeDefaultValues: true, // 暴露默认值
    exposeUnsetFields: false, // 暴露未设置的字段
    enableCircularCheck: true, // 启用循环检查
  },
  stopAtFirstError: true, // 每个字段遇到第一个错误时停止验证
  validationError: {
    target: false, // 不包含目标对象
    value: true, // 不包含验证失败的值 可以避免在错误响应中暴露原始数据
  },
  exceptionFactory: (errors) => {
    // 自定义错误响应
    const messages = errors.map((err) => {
      const field = err.property // 字段名
      //   const value = err.value // 字段值
      // { isString: 'content must be a string', isNotEmpty: '树洞内容不能为空' }
      // { isEnum: '树洞类型必须是 timeline 或 treehole', isNotEmpty: '树洞类型不能为空' }
      const constraints = Object.values(err.constraints) // NOTE 错误消息: constraints是一个对象，包含了所有的错误消息
      return { field, messages: constraints }
    })
    return new BadRequestException({ errors: messages })
  },
})
