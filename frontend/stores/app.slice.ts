import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '@store'
import { Maps } from '@types'
import { HYDRATE } from 'next-redux-wrapper'

const initialState: AppState = {
  isLoad: false,

  currentMap: {} as Maps,
  availableMaps: [],

  isMenuOpen: false,
}

// Slice
////////////////////////////////////////////////////////////////////////
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    appLoaded: (
      state,
      { payload }: PayloadAction<{ availableMaps: Maps[]; currentMap: Maps }>
    ) => {
      state.isLoad = true
      state.availableMaps = payload.availableMaps
      state.currentMap = payload.currentMap
    },
    openMenu: (state) => {
      state.isMenuOpen = true
    },
    closeMenu: (state) => {
      state.isMenuOpen = false
    },
    changedMap: (state, { payload }: PayloadAction<Maps>) => {
      state.currentMap = payload
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.app,
      }
    },
  },
})

export const { appLoaded, changedMap } = appSlice.actions
export default appSlice

// Action
