import path from 'path'
import { cwd } from 'process'
import { getStream } from 'file-stream-rotator'

// 配置日志轮转选项
const logDirectory = path.join(cwd(), 'logs') // 日志目录
const logFileName = 'typeorm_%DATE%' // 日志文件名
const logFileSize = '100k' // 日志文件大小限制
const logFileDatePattern = 'YYYY-MM-DD' // 日志文件日期格式

// FIXME
// [2024-11-25 16:25:15 622] error uncaughtException: Cannot call write after a stream was destroyed
// Error: Cannot call write after a stream was destroyed
//     at node:internal/fs/streams:426:23
//     at FSReqCallback.wrapper [as oncomplete] (node:fs:824:5)

// 创建日志轮转器
export const logStream = getStream({
  filename: path.join(logDirectory, logFileName),
  frequency: 'daily',
  date_format: logFileDatePattern,
  size: logFileSize,
  max_logs: '7d', // 保留7天的日志
  create_symlink: false, // 创建符号链接
  extension: '.log', // 日志文件扩展名
  audit_file: path.join(logDirectory, 'log-audit.json'), // 日志审计文件名
})
