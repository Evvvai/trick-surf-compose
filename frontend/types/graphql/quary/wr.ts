import { gql } from 'graphql-request'

export const SWR = gql`
  query ($trickId: Int!) {
    swr(trickId: $trickId) {
      id
      speed
      time
      dateAdd
      player {
        id
        steamid64
        nick
        profileurl
        avatarfull
        avatarCustom
      }
    }
  }
`

export const TWR = gql`
  query ($trickId: Int!) {
    twr(trickId: $trickId) {
      id
      speed
      time
      dateAdd
      player {
        id
        steamid64
        nick
        profileurl
        avatarfull
        avatarCustom
      }
    }
  }
`
