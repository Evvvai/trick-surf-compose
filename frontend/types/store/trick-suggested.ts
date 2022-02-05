import { Pagination, Player } from '@store'
import { Trigger } from './tricks'
import { RateType } from '../../components/suggested-tricks/suggested-tricks-item/SuggestedTricksItem.component'

export interface TrickSuggestedState {
  isLoad: boolean
  tricksSuggested: TrickSuggested[]
  myRates: TrickSuggestedRates[]
  pagination: Pagination
}

export interface TrickSuggested {
  id: number
  name: string
  point: number
  velocity: number
  dateAdd: Date
  dateModify: Date
  status: 'pending' | 'declined' | 'accepted'
  mapId: number
  route: Trigger[]
  author: Player
  rates: {
    up: number
    down: number
  }
}

export interface TrickSuggestedRates {
  id: number
  trickId: number
  playerId: number
  rate: RateType
  dateAdd: Date
}

export enum TrickSuggestedStatus {
  PENDING = 'pending',
  DECLINED = 'declined',
  ACCEPTED = 'accepted',
}
