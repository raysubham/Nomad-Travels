import gql from 'graphql-tag'

export const HOST_LISTING = gql`
  mutation HostListing($input: HostListingInput!) {
    hostListing(input: $input) {
      id
    }
  }
`
