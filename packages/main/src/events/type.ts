export interface Message {
  type: 'offer' | 'answer' | 'candidate' | 'initialize' | 'leave' | 'chat'
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
