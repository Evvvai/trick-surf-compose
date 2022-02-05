import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit'
import { browserStorage } from 'utils/browser'
import { HYDRATE } from 'next-redux-wrapper'
import { Player, PlayerState } from '@store'
import { PlayerAuth } from '../types/store/player'

const initialState: PlayerState = {
  isLoggedIn: false,
  playerInfo: {} as Player,
}

// Slice
////////////////////////////////////////////////////////////////////////
const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayerSetting: (state, { payload }: PayloadAction<PlayerAuth>) => {
      state.isLoggedIn = true
      state.playerInfo = payload.player
    },
    removePlayerSetting: (state) => {
      browserStorage.removeItem('jwt')
      state.isLoggedIn = false
      state.playerInfo = {} as Player
    },
    setDashboard: (state, { payload }: PayloadAction<string>) => {
      state.playerInfo.dashboard = payload
    },
    setAvatar: (state, { payload }: PayloadAction<string>) => {
      state.playerInfo.avatarCustom = payload
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.player,
      }
    },
  },
})

export const { setPlayerSetting } = playerSlice.actions
export default playerSlice

// Action
///////////////////////////////////////////////////////////////////////////////////////////////////
