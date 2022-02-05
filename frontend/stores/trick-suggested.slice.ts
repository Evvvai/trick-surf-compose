import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  TrickSuggested,
  TrickSuggestedState,
  Pagination,
  TrickSuggestedRates,
} from '@store'
import { HYDRATE } from 'next-redux-wrapper'
import { RateType } from '../components/suggested-tricks/suggested-tricks-item/SuggestedTricksItem.component'

const initialState: TrickSuggestedState = {
  isLoad: false,
  tricksSuggested: [],
  myRates: [],
  pagination: {} as Pagination,
}

// Slice
////////////////////////////////////////////////////////////////////////
const trickSuggestedSlice = createSlice({
  name: 'trickSuggested',
  initialState,
  reducers: {
    loadedTrickSuggested: (
      state,
      {
        payload,
      }: PayloadAction<{
        tricksSuggested: TrickSuggested[]
        pagination: Pagination
        myRates: TrickSuggestedRates[]
      }>
    ) => {
      state.isLoad = true
      state.tricksSuggested = payload.tricksSuggested
      state.myRates = payload.myRates
      state.pagination = payload.pagination
    },
    changedPagination: (state, { payload }: PayloadAction<Pagination>) => {
      state.pagination = payload
    },
    declinedTrick: (state, { payload }: PayloadAction<TrickSuggested>) => {
      const updatedTricks = [...state.tricksSuggested] as TrickSuggested[]
      const currentTrick = updatedTricks.find(
        (val) => val.id === payload.id
      ) as TrickSuggested
      currentTrick.status = 'declined'
    },
    acceptedTrick: (state, { payload }: PayloadAction<TrickSuggested>) => {
      const updatedTricks = [...state.tricksSuggested] as TrickSuggested[]
      const currentTrick = updatedTricks.find(
        (val) => val.id === payload.id
      ) as TrickSuggested
      currentTrick.status = 'accepted'
    },
    resetTrickSuggested: (state) => {
      state.isLoad = false
      state.tricksSuggested = []
      state.pagination = {
        ...state.pagination,
        offset: 0,
      }
    },
    changedMyRate: (state, { payload }: PayloadAction<TrickSuggestedRates>) => {
      const updatedTricks = [...state.tricksSuggested] as TrickSuggested[]
      const currentTrick = updatedTricks.find(
        (val) => val.id === payload.trickId
      ) as TrickSuggested

      const myTrickRate = [...state.myRates] as TrickSuggestedRates[]
      const currentMyTrickRate = state.myRates.find(
        (val) => val.trickId === payload.trickId
      ) as TrickSuggestedRates | undefined

      if (currentMyTrickRate) {
        currentMyTrickRate.rate = payload.rate
        ++currentTrick.rates[payload.rate]
        --currentTrick.rates[payload.rate === 'down' ? 'up' : 'down']
      } else {
        myTrickRate.push(payload)
        ++currentTrick.rates[payload.rate]
      }

      state.myRates = myTrickRate
      state.tricksSuggested = updatedTricks
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.trickSuggested,
      }
    },
  },
})

export const { loadedTrickSuggested, resetTrickSuggested } =
  trickSuggestedSlice.actions
export default trickSuggestedSlice

// Action
