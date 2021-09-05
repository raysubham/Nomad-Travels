import gql from 'graphql-tag'

export const DISCONNECT_STRIPE = gql`
  mutation DisconnectStripe {
    disconnectStripe {
      hasWallet
    }
  }
`
