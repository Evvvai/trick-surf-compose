import { AnyAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'

// Sockets On
import { friendSocketOn } from './friend/friend-socket-on'
import { notificationSocketOn } from './notification/notification-socket-on'
import { syncSocketOn } from './sync/sync-socket-on'
import { playerSocketOn } from './player/player-socket-on'

////////////////////////////////////////////////////////////////////////
const SocketsOn = (socket: any, dispatch: Dispatch<AnyAction>) => {
  playerSocketOn(socket, dispatch)
  friendSocketOn(socket, dispatch)
  notificationSocketOn(socket, dispatch)
  syncSocketOn(socket, dispatch)
}

export default SocketsOn
