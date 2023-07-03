import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Namespace, Server, Socket } from 'socket.io'
import { from, map } from 'rxjs'
import { ServerToClientEvents } from './type'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  // namespace:'/' 默认命名空间是: /
})
export class DefaultGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  namespaces: Namespace[] = []
  ids: string[] = []

  @WebSocketServer()
  server: Server<ServerToClientEvents>

  handleConnection(client: Socket, ...rest: unknown[]) {
    console.log('socket.io client connected', client.id, rest)
  }

  handleDisconnect(client: Socket) {
    console.log('socket.io client connected', client.id)
  }

  afterInit(server: Server) {
    this.server = server
  }

  @SubscribeMessage('register')
  register(@ConnectedSocket() client: Socket) {
    const id = client.id
    this.ids.push(id)
    return from([1, 2]).pipe(
      map((num) => ({
        event: num === 1 ? 'onRegister' : id,
        data:
          num === 1
            ? JSON.stringify({ msg: 'register success', ids: this.ids })
            : JSON.stringify({ msg: `welcome ${id}` }),
      }))
    )
  }

  alert(_msg?: string) {
    this.server.emit('notification', '这是一段来自服务端的通知')
  }
}
