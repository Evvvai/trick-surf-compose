import { gql } from 'graphql-request'

export const LEADERBOARD = gql`
  query ($mapId: Int!, $limit: Int, $offset: Int) {
    leaderboard(input: { mapId: $mapId, limit: $limit, offset: $offset }) {
      acPlace
      ac
      apPlace
      ap
      upPlace
      up
      ucPlace
      uc
      place
      completesPercent
      avg
      player {
        id
        steamid
        steamid64
        nick
        profileurl
        avatarfull
        avatarCustom
        role
      }
    }
  }
`

export const LEADERBOARD_CACHED = gql`
  query ($mapId: Int!, $limit: Int, $offset: Int) {
    leaderboardCached(
      input: { mapId: $mapId, limit: $limit, offset: $offset }
    ) {
      acPlace
      ac
      apPlace
      ap
      upPlace
      up
      ucPlace
      uc
      place
      completesPercent
      avg
      player {
        id
        steamid
        steamid64
        nick
        profileurl
        avatarfull
        avatarCustom
        role
      }
    }
  }
`
