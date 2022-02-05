export interface PlayerI {
  id: number
  steamid: string | null
  steamid64: string | null
  nick: string | null
  profileurl: string
  avatarCustom: string
  avatarfull: string
  dashboard: string
  lastLoginSite: Date
  lastLoginServer: Date
  role: Role

  avatar: string
}

export enum Role {
  PLAYER = 'player',
  PREMIUM = 'premium',
  ADMIN = 'admin',
}
