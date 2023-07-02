import { IoAdapter } from '@nestjs/platform-socket.io'
import { Server } from 'socket.io'

/**
 * @deprecated
 */
export class CustomIoAdapter extends IoAdapter {
  createIOServer(port: number, options) {
    // 添加多个命名空间的监听器
    const server: Server = super.createIOServer(port, options)
    server.of('/socket.io').on('connection', (socket) => {
      // 处理命名空间1的连接和事件
      console.log('Connected to socket.io', socket.id)
    })
    server.of('/events').on('connection', (socket) => {
      // 处理命名空间2的连接和事件
      console.log('Connected to events', socket.id)
    })

    return server
  }
}
