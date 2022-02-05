import { AnyAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'

// Sockets Actions
import { playerSocket } from './player/player-socket'
import { notificationSocket } from './notification/notification-socket'
import { friendSocket } from './friend/friend-socket'

////////////////////////////////////////////////////////////////////////
const SocketsActions: Record<
  string,
  (
    type: string,
    socket: any,
    payload: any,
    dispatch: Dispatch<AnyAction>
  ) => void
> = {
  player: playerSocket,
  friend: friendSocket,
  notification: notificationSocket,
}

export default SocketsActions
