import type { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets'
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'
import { Server, Socket } from 'socket.io'
import { ClientToServerEvents, Message, ServerToClientEvents } from './type'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'events',
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server<ServerToClientEvents>

  constructor() {
    this.ids = []
  }

  handleConnection(client: Socket, ...rest: unknown[]) {
    console.log('events client connected', client.id, rest)
  }

  handleDisconnect(client: Socket) {
    console.log('client connected', client.id)
  }

  afterInit(server: Server) {
    this.server = server
  }

  // 测试功能
  ids: string[]
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

  // 会议室业务
  rootAdmin: string | undefined

  @SubscribeMessage('create or join')
  async createOrJoin(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket<ClientToServerEvents, ServerToClientEvents>
  ) {
    const clientsRoom = this.server.sockets.adapter.rooms.get(room)
    const numberClients = clientsRoom?.size || 0

    const res = client.join(room)

    if (res instanceof Promise) res.catch(console.error)
    console.log(`${client.id} joined`)
    if (numberClients === 0) {
      // 处理创建房间后的逻辑
      this.rootAdmin = client.id
      client.emit('created', room, client.id)
    } else {
      // 处理加入房间后的逻辑，事件推送
      this.server.sockets.in(room).emit('join', room) // 通知房间内的其他用户
      this.server.to(client.id).emit('joined', room, client.id) // 通知客户端它加入了房间
      this.server.sockets.in(room).emit('ready', client.id) // 房间准备创建连接
    }
  }

  @SubscribeMessage('message')
  async onMessage(
    @MessageBody() data: [Message, string | null | undefined, string | null | undefined],
    @ConnectedSocket() client: Socket<ClientToServerEvents, ServerToClientEvents>
  ) {
    const [message, toId, room] = data
    if (toId) this.server.to(toId).emit('message', message, client.id) // 向特定用户发送
    else if (room) client.broadcast.to(room).emit('message', message, client.id) // 客户端在房间内广播数据
    else client.broadcast.emit('message', message, client.id) // 客户端广播消息
  }

  @SubscribeMessage('kickout')
  async onKickout(
    @MessageBody() data: [string, string],
    @ConnectedSocket() client: Socket<ClientToServerEvents, ServerToClientEvents>
  ) {
    const [socketId, room] = data
    if (this.rootAdmin === client.id) {
      client.broadcast.emit('kickout', socketId)
      const res = this.server.sockets.sockets.get(socketId)?.leave(room)
      if (res instanceof Promise) res.catch(console.error)
    }
  }

  @SubscribeMessage('leave room')
  async onLeaveRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket<ClientToServerEvents, ServerToClientEvents>
  ) {
    const res = client.leave(room)
    if (res instanceof Promise) res.catch(console.error)
    client.emit('left room', client.id)
    client.broadcast.to(room).emit('message', { type: 'leave' }, client.id)
  }

  @SubscribeMessage('disconnecting')
  async onDisconnecting(@ConnectedSocket() client: Socket<ClientToServerEvents, ServerToClientEvents>) {
    client.rooms.forEach((room) => {
      if (room === client.id) return
      client.broadcast.to(room).emit('message', { type: 'leave' }, client.id)
    })
  }
}
