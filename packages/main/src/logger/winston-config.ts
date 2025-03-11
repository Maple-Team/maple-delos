import path from 'path'
import { FileTransportOptions } from 'winston/lib/winston/transports'
import winston from 'winston'
import { WinstonModuleOptions } from 'nest-winston'
import WinstonDailyRotateFile from 'winston-daily-rotate-file'

const errorLogFilePath = path.join(process.cwd(), 'logs', 'error.log')
const rejectLogFilePath = path.join(process.cwd(), 'logs', 'reject.log')
// @https://github.com/winstonjs/winston
// @https://github.com/winstonjs/winston/blob/master/docs/transports.md
const fileOption: FileTransportOptions = {
  maxsize: 1 * 1024 * 1024,
  maxFiles: 100,
}
const baseRotateFileOption: WinstonDailyRotateFile.DailyRotateFileTransportOptions = {
  dirname: 'logs',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '1m',
  maxFiles: '90d',
  level: 'info',
  filename: '%DATE%',
  extension: '.log', // 文件后缀
  //   createSymlink: true,
  //   symlinkName: 'request.log',
}

const formats = [
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss SSS' }),
  winston.format.splat(),
  winston.format.errors({ stack: true }),
  // NOTE @https://stackoverflow.com/questions/70786287/nodejs-winston-logger-not-printing-trace/72975220#72975220
  winston.format.printf(({ timestamp, level, message, stack }) => {
    const text = `[${timestamp}] ${level.toUpperCase()} ${message}`
    return stack ? `${text}\n${stack}` : text
  }),
]

/**
 * @description: winston配置
 * NOTE console和文件的输出会有差别
 */
export const winstonConfig: WinstonModuleOptions = {
  level: 'info',
  format: winston.format.combine(...formats),
  transports: [
    process.env.NODE_ENV === 'development'
      ? new winston.transports.Console({
          level: 'debug',
          // 统一格式
          //   format: winston.format.combine(
          //     winston.format.cli({
          //       level: true,
          //     }),
          //     ...formats
          //   ),
        })
      : null,
    new WinstonDailyRotateFile({
      ...baseRotateFileOption,
      level: 'info',
    }),
    // process.env.SHOWLARK_MESSAGE === 'true'
    //   ? new LarkHook({
    //       webhookUrl: 'https://open.feishu.cn/open-apis/bot/v2/hook/f44c17ad-06b0-4957-a5be-2b066fcef6ce',
    //       level: 'error',
    //       msgType: 'text',
    //       emitAxiosErrors: true,
    //     })
    //   : null,
  ].filter(Boolean),
  rejectionHandlers: [
    new winston.transports.File({
      filename: rejectLogFilePath,
      ...fileOption,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: errorLogFilePath,
      ...fileOption,
    }),
  ],
}
