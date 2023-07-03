import type { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets'
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Namespace, Socket } from 'socket.io'
import { ClientToServerEvents, Message, ServerToClientEvents } from './type'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'events',
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Namespace<ServerToClientEvents>

  handleConnection(client: Socket, ...rest: unknown[]) {
    console.log('events client connected', client.id, rest)
  }

  handleDisconnect(client: Socket) {
    console.log('client connected', client.id)
  }

  // 设置了自定义域名后
  afterInit(server: Namespace) {
    this.server = server
  }

  // 会议室业务
  rootAdmin: string | undefined

  @SubscribeMessage('create or join')
  async createOrJoin(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket<ClientToServerEvents, ServerToClientEvents>
  ) {
    const clientsRoom = this.server.adapter.rooms.get(room)
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
      this.server.in(room).emit('join', room) // 通知房间内的其他用户
      this.server.to(client.id).emit('joined', room, client.id) // 通知客户端它加入了房间
      this.server.in(room).emit('ready', client.id) // 房间准备创建连接
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
      const res = this.server.sockets.get(socketId)?.leave(room)
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
