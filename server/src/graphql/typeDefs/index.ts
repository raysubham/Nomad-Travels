import { gql } from 'apollo-server-core'

export const typeDefs = gql`
  type Query {
    authUrl: String!
    user(id: ID!): User!
  }

  type Mutation {
    logIn(input: LogInInput): Viewer!
    logOut: Viewer!
  }

  type Viewer {
    id: ID
    token: String
    avatar: String
    hasWallet: Boolean
    didRequest: Boolean!
  }

  type User {
    id: ID!
    name: String!
    avatar: String!
    email: String!
    hasWallet: Boolean!
    listings(limit: Int!, page: Int!): Listings!
    bookings(limit: Int!, page: Int!): Bookings
    income: Int
  }

  type Listing {
    id: ID!
    title: String!
    description: String!
    image: String!
    host: String!
    type: ListingType!
    city: String!
    address: String!
    bookings: Bookings!
    bookingsIndex: String!
    price: Int!
    numOfGuests: Int!
  }

  type Listings {
    total: Int!
    result: [Listing!]!
  }

  type Booking {
    id: ID!
    listing: Listing!
    tenant: User!
    checkIn: String!
    checkOut: String!
  }

  type Bookings {
    total: Int!
    result: [Booking!]!
  }

  enum ListingType {
    APARTMENT
    HOUSE
  }

  input LogInInput {
    code: String!
  }
`
