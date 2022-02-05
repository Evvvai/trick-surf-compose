import { AnyAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'

// User On
export const playerSocketOn = (socket: any, dispatch: Dispatch<AnyAction>) => {
  // Update the online users list every time a user logs in or out
  // socket.on('users online', (onlineUsers: any) => {
  //   console.log('users online', onlineUsers)
  //   // dispatch()
  // })
  socket.on('connected', (data: any) => {
    console.log('Connected')
  })
}
