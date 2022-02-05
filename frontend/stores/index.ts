import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import { rootReducer } from './rootReducer'
import socketMiddleware from './middleware/socketMiddleware'
import SocketClient from '../utils/sockets'
import thunk from 'redux-thunk'

export const socket = new SocketClient()

export function makeStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: [thunk, socketMiddleware(socket)],
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(socketMiddleware(socket)),
  })
}

export const store = makeStore()

export type RootStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<RootStore['getState']>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

export const wrapper = createWrapper<RootStore>(makeStore, { debug: false })
