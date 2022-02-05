import { gql } from 'graphql-request'

export const PLAYER = gql`
  query ($steamid64: String!) {
    findOneBySteamid64(steamid64: $steamid64) {
      id
      steamid64
      nick
      profileurl
      avatarfull
      avatarCustom
      dashboard
      dateJoined
      lastLoginSite
      lastLoginServer
      role
    }
  }
`

export const PLAYER_STATS = gql`
  query ($mapId: Int!, $steamid64: String!) {
    playerStats(mapId: $mapId, steamid64: $steamid64) {
      place
      avg
      ap
      apPlace
      ac
      acPlace
      up
      upPlace
      uc
      ucPlace
      completesPercent
      tricksPoints
      tricksCounts
      twrCounts
      swrCounts
      tricksCreated
    }
  }
`

export const PLAYER_BY_STEAMIDS = gql`
  query ($steamids64: [String!]!) {
    playersBySteamids(steamids64: $steamids64) {
      id
      steamid64
      profileurl
      avatarfull
      avatarCustom
      nick
      lastLoginSite
      lastLoginServer
      role
    }
  }
`
