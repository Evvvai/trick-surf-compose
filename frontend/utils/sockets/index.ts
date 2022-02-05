import { io, Socket } from 'socket.io-client'
import getToken from 'utils/getToken'

// A little API for the stateful socket connection, just to keep it out of the global
// namespace and away from the socket middleware
export default class SocketClient {
  socket: Socket | null | undefined

  connect(token: string) {
    if (process.env.NEXT_BACKEND_URL) {
      this.socket = io(process.env.NEXT_BACKEND_URL, {
        extraHeaders: {
          // Authorization: token,
          Authorization: getToken(),
        },
      })
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  emit(eventName: string, data: any) {
    if (this.socket) {
      this.socket.emit(eventName, data)
    }
  }

  on(eventName: string, func: () => void) {
    if (this.socket) {
      this.socket.on(eventName, func)
    }
  }
}
