import { gql } from 'graphql-request'

export const SEND_TRICK = gql`
  mutation (
    $name: String!
    $point: Int!
    $velocity: Int!
    $authorId: Int!
    $mapId: Int!
    $route: String!
  ) {
    sendTrick(
      input: {
        name: $name
        point: $point
        velocity: $velocity
        authorId: $authorId
        mapId: $mapId
        route: $route
      }
    ) {
      id
      name
      point
      velocity
      dateAdd
      dateModify
      authorId
      mapId
    }
  }
`
