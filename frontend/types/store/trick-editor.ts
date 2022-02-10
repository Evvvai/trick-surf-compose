import { Trigger, Trick } from '@store'

export interface TrickEditorState {
  isLoad: boolean

  name: string | null
  points: number | null
  trigger: Trigger
  route: Trigger[]
  velocity: boolean
  trickEditing: Trick | null
}
