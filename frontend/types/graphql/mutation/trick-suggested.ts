import { gql } from 'graphql-request'

export const RATE_TRICK = gql`
  mutation ($trickId: Int!, $rate: Rate!) {
    rateTrick(trickId: $trickId, rate: $rate) {
      id
      trickId
      playerId
      rate
      dateAdd
    }
  }
`

export const DECLINE_TRICK = gql`
  mutation ($trickId: Int!) {
    declineTrick(id: $trickId) {
      id
      status
    }
  }
`

export const ACCEPT_TRICK = gql`
  mutation ($trickId: Int!) {
    acceptTrick(id: $trickId) {
      id
      status
    }
  }
`
