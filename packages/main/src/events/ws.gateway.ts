import { WebSocketGateway, WebSocketServer, SubscribeMessage, WsResponse } from '@nestjs/websockets'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Server } from 'ws'

@WebSocketGateway(8080, {
  cors: {
    origin: '*',
  },
  // namespace: '/events/', //NOTE 命名空间仅socket.io库支持
  transports: ['websocket'],
})
export class EventsGateway {
  constructor() {
    this.ids = []
  }

  @WebSocketServer()
  server: Server

  ids: string[]

  @SubscribeMessage('events')
  onEvent(client: unknown, data: unknown): Observable<WsResponse<number>> {
    console.log(data)
    return from([1, 2, 3]).pipe(map((item) => ({ event: 'events', data: item })))
  }
}
