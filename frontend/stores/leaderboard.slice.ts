import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Leaderboard, LeaderboardState, Pagination } from '@store'
import { HYDRATE } from 'next-redux-wrapper'

const initialState: LeaderboardState = {
  isLoad: false,
  top: [],
  pagination: {
    limit: 100,
    offset: 100,
  },
}

// Slice
////////////////////////////////////////////////////////////////////////
const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    loadedLeaderboard: (
      state,
      { payload }: PayloadAction<{ top: Leaderboard[]; pagination: Pagination }>
    ) => {
      state.isLoad = true
      state.top = payload.top
      state.pagination = payload.pagination
    },
    changedPagination: (state, { payload }: PayloadAction<Pagination>) => {
      state.pagination = payload
    },
    resetLeaderboard: (state) => {
      state.isLoad = false
      state.top = []
      state.pagination = {
        ...state.pagination,
        offset: 0,
      }
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.leaderboard,
      }
    },
  },
})

export const { loadedLeaderboard, resetLeaderboard } = leaderboardSlice.actions
export default leaderboardSlice

// Action
