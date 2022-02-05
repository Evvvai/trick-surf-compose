import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { NotificationState } from '@store'
import { HYDRATE } from 'next-redux-wrapper'

const initialState: NotificationState = {
  isNotificationLoad: false,
  isNotificationOpen: false,
}

// Slice
////////////////////////////////////////////////////////////////////////
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    openNotification: (state) => {
      state.isNotificationOpen = true
    },
    closeNotification: (state) => {
      state.isNotificationOpen = false
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.notification,
      }
    },
  },
})

// export const {} = friendSlice.actions
export default notificationSlice

// Action
