import { combineReducers } from 'redux'

// Import slices
import appSlice from './app.slice'
import playerSlice from './player.slice'
import friendSlice from './friend.slice'
import notificationSlice from './notification.slice'
import trickSlice from './trick.slice'
import leaderboardSlice from './leaderboard.slice'
import trickEditorSlice from './trick-editor.slice'
import trickSuggestedSlice from './trick-suggested.slice'

// Combine
export const rootReducer = combineReducers({
  [appSlice.name]: appSlice.reducer,
  [playerSlice.name]: playerSlice.reducer,
  [friendSlice.name]: friendSlice.reducer,
  [notificationSlice.name]: notificationSlice.reducer,
  [trickSlice.name]: trickSlice.reducer,
  [leaderboardSlice.name]: leaderboardSlice.reducer,
  [trickEditorSlice.name]: trickEditorSlice.reducer,
  [trickSuggestedSlice.name]: trickSuggestedSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>
