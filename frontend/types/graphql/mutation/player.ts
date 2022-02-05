import { gql } from 'graphql-request'

export const SET_AVATAR = gql`
  mutation ($url: String!) {
    setAvatar(url: $url) {
      id
      steamid64
      avatarCustom
    }
  }
`

export const SET_DASHBOARD = gql`
  mutation ($url: String!) {
    setDashboard(url: $url) {
      id
      steamid64
      dashboard
    }
  }
`
export const PLAYER_NEW_FRIENDS = gql`
  mutation {
    playerNewFriends {
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
`
