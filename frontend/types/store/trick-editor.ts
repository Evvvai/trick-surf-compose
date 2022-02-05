import { Trigger } from '@store'

export interface TrickEditorState {
  isLoad: boolean

  name: string | null
  points: number | null
  trigger: Trigger
  route: Trigger[]
  velocity: boolean
  trickEditingId: number | null
}
