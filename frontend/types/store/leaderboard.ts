import { Player } from '@store'

export interface LeaderboardState {
  isLoad: boolean
  top: Leaderboard[]
  pagination: Pagination
}

export interface Leaderboard {
  acPlace: number
  ac: number
  apPlace: number
  ap: number
  upPlace: number
  up: number
  ucPlace: number
  uc: number
  avg: string
  place: number
  completesPercent: string
  player: Player

  /////////////////////////////////////////////////////////////////////////////////
  // Relations

  // route: Trigger[]
  // completes: Completes[];
  // swrs: Swr[];
  // author: Players;
  // twrs: Twr[];
  // map: Maps;
}

export interface Pagination {
  limit: number
  offset: number
}
