import { gql } from 'graphql-request'

export const SUGGESTED_TRICK = gql`
  query ($mapId: Int!, $limit: Int, $offset: Int) {
    suggestedTricks(input: { mapId: $mapId, limit: $limit, offset: $offset }) {
      id
      name
      point
      velocity
      dateAdd
      dateModify
      status
      mapId
      route {
        id
        name
        alternativeName
        src
        x
        y
        z
      }
      author {
        id
        steamid
        steamid64
        nick
        profileurl
        avatarfull
        avatarCustom
        role
      }
      rates {
        up
        down
      }
    }
  }
`

export const PLAYER_RATE = gql`
  query ($ids: [Int!]!) {
    playerRate(ids: $ids) {
      id
      trickId
      playerId
      rate
      dateAdd
    }
  }
`
