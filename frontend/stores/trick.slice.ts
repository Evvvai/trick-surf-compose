import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  FiltersTrick,
  SortTrickSetting,
  Trick,
  TrickState,
  Trigger,
} from '@store'
import { HYDRATE } from 'next-redux-wrapper'

const initialState: TrickState = {
  isLoad: false,
  tricks: [],
  triggers: [],

  sortSettings: {
    dir: 'asc',
    sort: 'index',
  } as SortTrickSetting,
  filters: {
    term: '',
    pointsRange: {
      max: 0,
      min: 0,
    },
    triggers: [],
  },

  filteredTricks: [],
}

// Slice
////////////////////////////////////////////////////////////////////////
const trickSlice = createSlice({
  name: 'trick',
  initialState,
  reducers: {
    loadedTricks: (
      state,
      { payload }: PayloadAction<{ tricks: Trick[]; triggers: Trigger[] }>
    ) => {
      state.isLoad = true
      state.tricks = payload.tricks
      state.filteredTricks = payload.tricks
      state.triggers = payload.triggers
      state.filters = {
        ...state.filters,
        pointsRange: {
          min: Math.min(...payload.tricks.map((x) => x.point)),
          max: Math.max(...payload.tricks.map((x) => x.point)),
        },
      }
    },
    resetTricks: (state) => {
      state.isLoad = false
      state.tricks = []
      state.triggers = []
    },
    filtered: (
      state,
      { payload }: PayloadAction<{ tricks: Trick[]; filters: FiltersTrick }>
    ) => {
      state.filteredTricks = payload.tricks
      state.filters = payload.filters
    },
    sorted: (
      state,
      {
        payload,
      }: PayloadAction<{ tricks: Trick[]; sortSetting: SortTrickSetting }>
    ) => {
      state.tricks = payload.tricks
      state.sortSettings = payload.sortSetting
    },
    updatedTrigger: (state, { payload }: PayloadAction<Trigger>) => {
      state.triggers = state.triggers.map((val) => {
        if (val.id === payload.id) {
          val = payload
        }
        return val
      })
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.trick,
      }
    },
  },
})

export const { loadedTricks, resetTricks } = trickSlice.actions
export default trickSlice

// Action
