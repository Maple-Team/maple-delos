import * as path from 'path'
import { cwd } from 'process'
import * as fileStreamRotator from 'file-stream-rotator'

// 配置日志轮转选项
const logDirectory = path.join(cwd(), 'logs') // 日志目录
const logFileName = 'typeorm_%DATE%' // 日志文件名
const logFileSize = '100k' // 日志文件大小限制
const logFileDatePattern = 'YYYY-MM-DD' // 日志文件日期格式

// 创建日志轮转器
export const logStream = fileStreamRotator.getStream({
  filename: path.join(logDirectory, logFileName),
  frequency: 'daily',
  date_format: logFileDatePattern,
  size: logFileSize,
  max_logs: '7d', // 保留7天的日志
  create_symlink: false, // 创建符号链接
  extension: '.log', // 日志文件扩展名
  audit_file: path.join(logDirectory, 'log-audit.json'), // 日志审计文件名
})
