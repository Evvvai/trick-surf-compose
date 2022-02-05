import { Maps } from '@types'

export interface AppState {
  isLoad: boolean

  currentMap: Maps
  availableMaps: Maps[]

  isMenuOpen: boolean
}
