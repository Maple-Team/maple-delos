import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'
import { Server } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'events',
})
export class EventsGateway {
  constructor() {
    this.ids = []
  }

  @WebSocketServer()
  server: Server

  ids: string[]

  @SubscribeMessage('register')
  register(@MessageBody() id: string) {
    this.ids.push(id)
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
    this.ids.splice(this.ids.indexOf(id) >>> 1, 1)
    return from([1]).pipe(
      map(() => ({
        event: 'broadcast',
        data: { msg: 'unRegister success', ids: this.ids, id },
      }))
    )
  }

  @SubscribeMessage('broadcast')
  broadcast(@MessageBody() msg: string) {
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
