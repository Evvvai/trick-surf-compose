import { AnyAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'

// Friend On
export const friendSocketOn = (socket: any, dispatch: Dispatch<AnyAction>) => {
  socket.on('friend/load', (friends: any) => {
    dispatch({
      type: 'friend/loadFriends',
      payload: friends,
    })
  })
  socket.on('friend/online', (friendId: number) => {
    dispatch({
      type: 'friend/friendOnline',
      payload: friendId,
    })
  })
  socket.on('friend/offline', (friendId: number) => {
    dispatch({
      type: 'friend/friendOffline',
      payload: friendId,
    })
    console.log('friendOffline')
  })
}
