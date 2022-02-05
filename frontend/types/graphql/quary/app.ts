import { gql } from 'graphql-request'

export const MAPS = gql`
  query {
    maps {
      id
      name
      alternativeName
      src
      dateCreated
    }
  }
`
