import * as path from 'path'
import { FileTransportOptions } from 'winston/lib/winston/transports'
import * as winston from 'winston'
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
}

const formats = [
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss SSS',
  }),
  winston.format.splat(),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level} ${message}`
  }),
]
export const winstonConfig: WinstonModuleOptions = {
  level: 'info',
  format: winston.format.combine(...formats),
  transports: [
    process.env.NODE_ENV !== 'production'
      ? new winston.transports.Console({
          level: 'debug',
          format: winston.format.combine(
            winston.format.cli({
              level: true,
            }),
            ...formats
          ),
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
