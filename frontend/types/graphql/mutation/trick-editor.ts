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

export const UPDATE_TRICK = gql`
  mutation (
    $id: Int!
    $name: String!
    $point: Int!
    $routeIds: String!
    $velocity: Int!
  ) {
    updateTrick(
      input: {
        id: $id
        name: $name
        point: $point
        route: $routeIds
        velocity: $velocity
      }
    ) {
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
