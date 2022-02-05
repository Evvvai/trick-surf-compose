import { gql } from 'graphql-request'

export const UPDATE_TRIGGER = gql`
  mutation ($src: String!, $name: String!, $id: Int!) {
    updateTrigger(input: { src: $src, name: $name, id: $id }) {
      id
      name
      alternativeName
      src
    }
  }
`
