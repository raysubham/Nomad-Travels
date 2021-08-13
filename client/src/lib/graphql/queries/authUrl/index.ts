import gql from 'graphql-tag'

export const AUTH_URL = gql`
  query AuthUrl {
    authUrl
  }
`
