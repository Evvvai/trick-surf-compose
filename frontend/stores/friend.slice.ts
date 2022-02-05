import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Friend, FriendState } from '@store'
import { HYDRATE } from 'next-redux-wrapper'

const initialState: FriendState = {
  isFriendLoad: false,
  isFriendOpen: false,

  friends: [],
  filteredFriendsIds: [],

  term: '',
}

// Slice
////////////////////////////////////////////////////////////////////////
const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    openFriend: (state) => {
      state.isFriendOpen = true
    },
    closeFriend: (state) => {
      state.isFriendOpen = false
    },
    loadFriends: (state, { payload }: PayloadAction<Friend[]>) => {
      state.isFriendLoad = true
      state.friends = payload
      state.filteredFriendsIds = payload.map((friend) => friend.id)
    },
    updatedFriends: (state, { payload }: PayloadAction<Friend[]>) => {
      state.friends = [...state.friends, ...payload]
    },
    friendOnline: (state, { payload }: PayloadAction<number>) => {
      state.friends = state.friends.map((val) => {
        if (val.id === payload) val.online = true
        return val
      })
    },
    friendOffline: (state, { payload }: PayloadAction<number>) => {
      state.friends = state.friends.map((val) => {
        if (val.id === payload) {
          val.online = false
          val.lastLoginSite = new Date()
        }
        return val
      })
    },
    filteredFriends: (
      state,
      { payload }: PayloadAction<{ ids: number[]; term: string }>
    ) => {
      state.filteredFriendsIds = payload.ids
      state.term = payload.term
    },
  },
  // extraReducers: {
  //   [HYDRATE]: (state, action) => {
  //     return {
  //       ...state,
  //       ...action.payload.friend,
  //     }
  //   },
  // },
})

// export const {} = friendSlice.actions
export default friendSlice

// Action
