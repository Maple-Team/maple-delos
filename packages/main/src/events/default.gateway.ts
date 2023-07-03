import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ServerToClientEvents } from './type'

type CustomServerToClientEvents = Pick<ServerToClientEvents, 'notification'> & {
  [key: string]: (...rest: unknown[]) => void
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  // 默认命名空间是: /
  namespace: 'default',
})

/**
 * 通用gateway，往客户端发送消息
 */
export class DefaultGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server<CustomServerToClientEvents>

  handleConnection(client: Socket, ...rest: unknown[]) {
    console.log('default gateway client connected', client.id, rest)
  }

  handleDisconnect(client: Socket) {
    console.log('default gateway client disconnected', client.id)
    client.broadcast.emit('leave', client.id)
  }

  afterInit(server: Server) {
    this.server = server
    // Add the middleware function to the Socket.io server
    this.server.use(this.customMiddleware)
  }

  test1(clientId?: string, _msg?: string) {
    this.server.emit('notification', '这是一段来自服务端的通知')
    // 默认命名空间 this.server.sockets.sockets: map
    // const clients = this.server.sockets.sockets

    // 设定了命名空间 this.server.sockets：map
    const clients = this.server.sockets as unknown as Map<string, Socket>

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
    const token = socket.handshake.query.token // 假设通过查询参数传递令牌
    console.log(token)
    // TODO 根据token解析用户信息，再关联socket id
    next() // Call next() to continue with the execution of other middleware or the actual event handlers
  }
}
