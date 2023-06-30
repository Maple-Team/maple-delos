import type { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WsResponse } from '@nestjs/websockets'
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import type { Observable } from 'rxjs'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'
import type { Server, WebSocket } from 'ws'

@WebSocketGateway(8080, {
  cors: {
    origin: '*',
  },
  // namespace: '/events/', //NOTE 命名空间仅socket.io库支持
  transports: ['websocket'],
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server

  wsClients: WebSocket[] = []

  handleConnection(client: WebSocket) {
    this.wsClients.push(client)
  }

  handleDisconnect(client: WebSocket) {
    const index = this.wsClients.indexOf(client)
    this.wsClients.splice(index >>> 0, 1)

    this.broadcast('disconnect', client)
  }

  private broadcast(event, message: unknown) {
    const broadCastMessage = JSON.stringify(message)
    for (const c of this.wsClients) c.send(broadCastMessage)
  }

  afterInit() {
    this.server.emit('testing', { do: 'stuff' })
  }

  @SubscribeMessage('events')
  onEvent(client: unknown, data: unknown): Observable<WsResponse<number>> {
    console.log(data)
    return from([1, 2, 3]).pipe(map((item) => ({ event: 'events', data: item })))
  }
}
