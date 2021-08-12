import gql from 'graphql-tag'

const AUTH_URL = gql`
  query AuthUrl {
    authUrl
  }
`
