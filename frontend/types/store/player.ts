export interface PlayerState {
  isLoggedIn: boolean
  playerInfo: Player
}

export interface Player {
  id: number
  nick: string
  steamid64: string
  avatarfull: string
  avatarCustom: string
  dashboard: string
  dateJoined: Date | null
  lastLoginSite: Date
  lastLoginServer: Date
  role: Role
}

export interface PlayerStats {
  avg: string
  ap: number
  apPlace: number
  ac: number
  acPlace: number
  up: number
  upPlace: number
  uc: number
  ucPlace: number
  completesPercent: string
  tricksPoints: number
  tricksCounts: number
  twrCounts: number
  swrCounts: number
  tricksCreated: number
}

export interface PlayerAuth {
  token: string
  player: Player
}

export enum Role {
  PLAYER = 'player',
  PREMIUM = 'premium',
  ADMIN = 'admin',
}
