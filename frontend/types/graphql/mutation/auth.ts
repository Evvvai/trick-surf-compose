import { gql } from 'graphql-request'

export const AUTH = gql`
  mutation {
    auth {
      token
      player {
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
  }
`
