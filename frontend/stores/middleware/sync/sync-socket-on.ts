import { AnyAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'

// Sync On
export const syncSocketOn = (socket: any, dispatch: Dispatch<AnyAction>) => {
  socket.on('sync', (socketIds: any) => {
    socket.emit('sync', socketIds)
  })

  socket.on('error', (Exception: any) => {
    console.log('Connected')
  })
}
