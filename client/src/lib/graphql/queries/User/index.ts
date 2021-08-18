import gql from 'graphql-tag'

export const USER = gql`
  query User($id: ID!, $limit: Int!, $listingsPage: Int!, $bookingsPage: Int!) {
    user(id: $id) {
      id
      name
      avatar
      email
      hasWallet
      income
      listings(limit: $limit, page: $listingsPage) {
        total
        result {
          id
          title
          image
          address
          price
          numOfGuests
        }
      }
      bookings(limit: $limit, page: $bookingsPage) {
        total
        result {
          id
          checkIn
          checkOut
          listing {
            id
            title
            image
            address
            price
            numOfGuests
          }
        }
      }
    }
  }
`
