import { gql } from 'graphql-request'

export const TRIGGERS = gql`
  query ($mapId: Int!) {
    triggers(input: { mapId: $mapId }) {
      id
      name
      alternativeName
      src
      mapId
    }
  }
`
