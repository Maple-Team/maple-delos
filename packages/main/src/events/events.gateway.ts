import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  // namespace: 'socket.io', // FIXME 命名空间自定义不起作用，待测试
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor() {
    this.ids = []
  }

  handleConnection() {}

  handleDisconnect() {}

  afterInit() {}

  @WebSocketServer()
  server: Server

  ids: string[]

  @SubscribeMessage('register')
  register(@MessageBody() id: string, @ConnectedSocket() client: Socket) {
    this.ids.push(id)

    console.log('id', id, client.id)
    return from([1, 2]).pipe(
      map((num) => ({
        event: num === 1 ? 'onRegister' : id,
        data:
          num === 1
            ? { msg: 'register success', ids: this.ids }
            : {
                msg: `welcome ${id}`,
              },
      }))
    )
  }

  @SubscribeMessage('unRegister')
  unRegister(@MessageBody() id: string) {
    console.log('unRegister', id)
    this.ids.splice(this.ids.indexOf(id) >>> 1, 1)
    return from([1]).pipe(
      map(() => ({
        event: 'broadcast',
        data: { msg: 'unRegister success', ids: this.ids, id },
      }))
    )
  }

  @SubscribeMessage('broadcast')
  broadcast(@MessageBody() _msg: string) {
    console.log('broadcast')
    return {
      event: 'broadcast',
      msg: 'hello all',
    }
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data
  }
}
