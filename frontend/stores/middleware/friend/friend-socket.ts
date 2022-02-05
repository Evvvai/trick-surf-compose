import { AnyAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'

// Friend
export const friendSocket = (
  type: string,
  socket: any,
  payload: any,
  dispatch: Dispatch<AnyAction>
) => {
  switch (type) {
    // User
    case 'sendedInvite': {
      socket.emit('sentInvite', payload)
      break
    }
    case 'removedInvite': {
      socket.emit('removeInvite', payload)
      break
    }
  }
}
