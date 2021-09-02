import gql from 'graphql-tag'

export const LISTING = gql`
  query Listing($id: ID!, $limit: Int!, $bookingsPage: Int!) {
    listing(id: $id) {
      id
      title
      description
      address
      city
      image
      host {
        id
        name
        avatar
        hasWallet
      }
      type
      price
      numOfGuests
      bookingsIndex
      bookings(limit: $limit, page: $bookingsPage) {
        total
        result {
          id
          tenant {
            id
            name
            avatar
          }
          checkIn
          checkOut
        }
      }
    }
  }
`
