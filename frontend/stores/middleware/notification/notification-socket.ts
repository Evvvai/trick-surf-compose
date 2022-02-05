import { AnyAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'

// Notification
export const notificationSocket = (
  type: string,
  socket: any,
  payload: any,
  dispatch: Dispatch<AnyAction>
) => {
  switch (type) {
    case 'acceptedInvite': {
      socket.emit('joinRoom', payload.room)
      break
    }
    case 'declinedInvite': {
      socket.emit('declineInvite', payload)
      break
    }
  }
}
