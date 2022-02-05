import { Player } from '@store'

export interface FriendState {
  isFriendLoad: boolean
  isFriendOpen: boolean

  friends: Friend[]
  filteredFriendsIds: number[]

  term: string
}

export interface Friend extends Player {
  online: boolean
  status: StatusFriend
}

export interface StatusFriend {
  action: '. . .' | 'playing'
}
