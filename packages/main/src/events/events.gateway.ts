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

export interface Message {
  type: 'offer' | 'answer' | 'candidate' | 'initialize' | 'leave'
  [key: string]: AnyToFix
}
export interface ServerToClientEvents {
  /**
   * 已创建会议室事件
   * @param room
   * @param socketId
   * @returns
   */
  created: (room: string, socketId: string) => void
  /**
   * 已加入会议室事件
   * @param room
   * @param socketId
   * @returns
   */
  joined: (room: string, socketId: string) => void
  /**
   * 有人加入会议室事件
   * @param room
   * @param socketId
   * @returns
   */
  join: (room: string) => void
  /**
   * 打印日志
   * @param log
   * @returns
   */
  log: (log: AnyToFix) => void
  /**
   *  Room is ready for connection
   * @param user
   * @returns
   */
  ready: (user: string) => void
  'left room': (room: string) => void
  /**
   * 有用户被踢出会议室
   * @param socketId
   * @returns
   */
  kickout: (socketId: string) => void
  message: (message: Message, socketId: string) => void
}

export interface ClientToServerEvents {
  /**
   * 客户端加入或创建房间
   * @param room
   * @returns
   */
  'create or join': (room: string) => void
  /**
   * 客户端离开房间
   * @param room
   * @returns
   */
  'leave room': (room: string) => void
  /**
   * 客户端向服务端发送数据
   * @param message
   * @param toId
   * @param roomId
   * @returns
   */
  message: (message: Message, toId?: string | null, roomId?: string | null) => void
  /**
   * 有用户被踢出会议室
   * @param socketId
   * @param room
   * @returns
   */
  kickout: (socketId: string, room: string) => void
}

export interface Participant {
  uid: string
  stream: MediaStream
}

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
