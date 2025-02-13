import fs from 'fs'
import path from 'path'
import { AbstractLogger, LogLevel, LogMessage, Logger, QueryRunner } from 'typeorm'
import { logStream } from './logger'

/**
 // @reference: https://orkhan.gitbook.io/typeorm/docs/logging#enabling-logging
typeorm 日志level说明
          // query - logs all queries.
          // error - logs all failed queries and errors.
          // schema - logs the schema build process.
          // warn - logs internal orm warnings.
          // info - logs internal orm informative messages.
          // log - logs internal orm log messages.

 */
// QueryRunner ✨✨✨
/**
 * @deprecated
 * 自定义日志记录
 */
export class CustomTypeormLogger2 implements Logger {
  private filePath: string
  constructor() {
    // 指定日志文件的路径
    this.filePath = path.join(process.cwd(), 'logs', 'typeorm-logs.log')
    // 确保日志文件夹存在
    if (!fs.existsSync(path.dirname(this.filePath))) fs.mkdirSync(path.dirname(this.filePath), { recursive: true })
  }

  writeLog = (message: string, parameters: AnyToFix[]) => {
    const date = new Date()
    fs.appendFile(
      this.filePath,
      `[${date.toLocaleDateString()} ${date.toLocaleTimeString()} ${date.getMilliseconds()}][Query]: ${message} -- PARAMETERS: ${JSON.stringify(
        parameters
      )}\n`,
      'utf8',
      (e) => {
        if (e) console.error('写入日志文件时出错:', e)
      }
    )
  }

  logQuery(query: string, parameters?: AnyToFix[]) {
    this.writeLog(query, parameters)
  }

  logQueryError(error: string | Error, query: string, parameters?: AnyToFix[]) {
    this.writeLog(`${query} -- ERROR: ${error}`, parameters)
  }

  logQuerySlow(time: number, query: string, parameters?: AnyToFix[]) {
    this.writeLog(`${query} -- Time: ${time}ms`, parameters)
  }

  logSchemaBuild(_message: string, _queryRunner?: QueryRunner) {}

  logMigration(_message: string) {}

  log(_level: 'log' | 'info' | 'warn', _message: AnyToFix) {
    // console.log('[CustomTypeormLogger2] [log]', level, message)
    // this.logger.debug('log')
  }
}

export class CustomTypeormLogger extends AbstractLogger {
  private filePath: string
  constructor() {
    super('all')
    // 指定日志文件的路径
    const date = new Date()
    const dateSuffix = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    // PERFORMANCE: 参考https://github.com/winstonjs/winston-daily-rotate-file
    this.filePath = path.join(process.cwd(), 'logs', `typeorm-logs_${dateSuffix}.log`)
    // 确保日志文件夹存在
    if (!fs.existsSync(path.dirname(this.filePath))) fs.mkdirSync(path.dirname(this.filePath), { recursive: true })
  }

  writeLogToFile = (message: string | number, prefix?: string) => {
    const date = new Date()
    const msg = `[${date.toLocaleDateString()} ${date.toLocaleTimeString()} ${date.getMilliseconds()}]${
      prefix ? `[${prefix}]` : ''
    }: ${message}\n`
    logStream.write(msg)
  }

  /**
   * Write log to specific output.
   */
  protected writeLog(level: LogLevel, logMessage: LogMessage | LogMessage[]) {
    const messages = this.prepareLogMessages(logMessage, {
      highlightSql: false, // 输出日志颜色是否高亮
    })

    for (const message of messages) {
      switch (message.type ?? level) {
        case 'log':
        case 'schema-build':
        case 'migration':
          this.writeLogToFile(message.message)
          break

        case 'info':
        case 'query':
          this.writeLogToFile(message.message, message.prefix)
          break

        case 'warn':
        case 'query-slow':
          this.writeLogToFile(message.message, message.prefix)

          break

        case 'error':
        case 'query-error':
          this.writeLogToFile(message.message, message.prefix)
          break
      }
    }
  }
}
