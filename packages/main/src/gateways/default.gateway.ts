import { clearInterval } from 'timers'
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Namespace, Socket } from 'socket.io'
import { OnModuleDestroy } from '@nestjs/common'
import { uuid } from '@liutsing/utils'
import { ServerToClientEvents } from './type'

type CustomServerToClientEvents = Pick<ServerToClientEvents, 'notification'> & {
  [key: string]: (...rest: unknown[]) => void
}
// 测试地址：https://piehost.com/socketio-tester
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  // 默认命名空间是: /
  namespace: 'default', // NOTE 客户端连接的地址：[protocol]://[host]:[port]/default
})

/**
 * 通用gateway，往客户端发送消息
 */
export class DefaultGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy {
  @WebSocketServer()
  server: Namespace<CustomServerToClientEvents>

  intervalId: NodeJS.Timeout

  /**
   * socket连接信息(重写的方法)
   * @param client
   * @param rest
   */
  handleConnection(client: Socket, ...rest: unknown[]) {
    console.log('socket.io default gateway client connected', client.id, rest)
    this.testLoopSendMessage(client)
    this.listenClientMessage(client)
  }

  private listenClientMessage(client: Socket) {
    client.on('message', (message) => {
      console.log('socket.io收到客户端的消息', message, client.id)
      client.emit('message', `单发：hello ${client.id}`)
      this.server.emit('message', `广播: hello ${client.id}`)
    })
    client.on('stopCmd', () => {
      console.log('socket.io收到客户端的消息: stopCmd')
      const status = Math.random() > 0.5
      client.emit('stopStatus', status, client.id)
    })
    client.on('unStopCmd', () => {
      console.log('socket.io收到客户端的消息: unStopCmd', client.id)
      const status = Math.random() > 0.5
      client.emit('stopStatus', status, client.id)
    })
    this.server.on('chat-message', (message) => {
      console.log('socket.io收到客户端的消息', message, client.id)
      client.emit('chat-message', `单发：hello ${client.id}`)
      //   this.server.emit('chat-message', `广播: hello ${client.id}`)
    })
    client.on('chat-message', (message) => {
      console.log('socket.io收到客户端的消息', message, client.id)
      client.emit('chat-message', `单发：hello ${client.id}`)
      //   this.server.emit('chat-message', `广播: hello ${client.id}`)
    })
  }

  /**
   * 测试用
   * 持续的发送消息给客户端
   * @param client
   */
  private testLoopSendMessage(client: Socket) {
    this.intervalId && clearInterval(this.intervalId)
    let prevUUID = uuid()
    this.intervalId = setInterval(() => {
      const message = {
        ts: new Date().getTime(),
        payload: { uuid: prevUUID },
      }
      if (Math.random() > 0.999) prevUUID = uuid()

      client.emit('interval', message)
    }, 100)
  }

  handleDisconnect(client: Socket) {
    console.log('default gateway client disconnected', client.id)
    client.broadcast.emit('leave', client.id)
  }

  // 设置了namespace后, 类型变更了
  afterInit(server: Namespace) {
    this.server = server
    // Add the middleware function to the Socket.io server
    this.server.use(this.customMiddleware)
  }

  test1(clientId?: string, _msg?: string) {
    this.server.emit('notification', '这是一段来自服务端的通知')
    const clients = this.server.sockets

    if (clientId) {
      const client = clients?.get(clientId)
      client?.emit(clientId, `hello ${clientId}`)
    } else {
      clients?.forEach((client) => {
        console.log(client.id)
        client?.emit(client.id, `hello ${client.id}`)
      })
    }
  }

  customMiddleware = (socket: Socket, next: (err?: AnyToFix) => void) => {
    // Custom middleware logic here
    const _token = socket.handshake.query.token // 假设通过查询参数传递令牌
    console.log(socket.handshake.query, 'query')
    // TODO 根据token解析用户信息，再关联socket id
    next() // Call next() to continue with the execution of other middleware or the actual event handlers
  }

  onModuleDestroy() {
    if (this.intervalId) clearInterval(this.intervalId)
  }
}
