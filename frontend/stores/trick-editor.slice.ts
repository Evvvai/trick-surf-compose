import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TrickEditorState, Trigger } from '@store'
import { HYDRATE } from 'next-redux-wrapper'

const initialState: TrickEditorState = {
  isLoad: false,

  name: '',
  points: null,
  trigger: {} as Trigger,
  route: [],
  velocity: false,
  trickEditingId: null,
}

// Slice
////////////////////////////////////////////////////////////////////////
const trickEditorSlice = createSlice({
  name: 'trickEditor',
  initialState,
  reducers: {
    loadedTrickEditor: (state, { payload }: PayloadAction<Trigger[]>) => {
      state.isLoad = true
      state.trigger = payload[0]
    },
    setRouteTrick: (state, { payload }: PayloadAction<Trigger[]>) => {
      state.route = payload
    },
    setTriggerTrick: (state, { payload }: PayloadAction<Trigger>) => {
      state.trigger = payload
    },
    setNameTrick: (state, { payload }: PayloadAction<string>) => {
      state.name = payload
    },
    setPointsTrick: (state, { payload }: PayloadAction<number>) => {
      state.points = payload
    },
    setVelocityTrick: (state, { payload }: PayloadAction<boolean>) => {
      state.velocity = payload
    },
    sendTrick: (state) => {
      state.name = ''
      state.points = null
      state.trigger = {} as Trigger
      state.route = []
      state.velocity = false
      state.trickEditingId = null
    },
    clearTrickEditor: (state) => {
      state.name = ''
      state.points = null
      state.trigger = {} as Trigger
      state.route = []
      state.velocity = false
      state.trickEditingId = null
    },
    resetTrickEditor: (state) => {
      state.isLoad = false

      state.name = ''
      state.points = null
      state.trigger = {} as Trigger
      state.route = []
      state.velocity = false
      state.trickEditingId = null
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.trickEditor,
      }
    },
  },
})

export const { loadedTrickEditor, resetTrickEditor } = trickEditorSlice.actions
export default trickEditorSlice

// Action
