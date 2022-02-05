import { gql } from 'graphql-request'

export const TRICK = gql`
  query ($mapId: Int!, $id: Int!) {
    trick(input: { mapId: $mapId }, id: $id) {
      id
      name
      point
      velocity
      dateAdd
      authorId
      mapId
    }
  }
`

export const TRICKS = gql`
  query ($mapId: Int!) {
    tricks(input: { mapId: $mapId }) {
      id
      index
      name
      point
      velocity
      dateAdd
      mapId
      route {
        id
        name
        alternativeName
        src
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
    }
  }
`

export const TRICKS_STATS = gql`
  query ($mapId: Int!, $steamId: String) {
    tricksStats(input: { mapId: $mapId, steamid: $steamId }) {
      id
      index
      name
      point
      velocity
      dateAdd
      completes
      myCompletes
      len
      routeIds
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
    }
  }
`
