import { gql } from 'apollo-server-core'

export const typeDefs = gql`
  type Query {
    authUrl: String!
    user(id: ID!): User!
    listing(id: ID!): Listing!
    listings(
      location: String
      filter: ListingsFilter!
      limit: Int!
      page: Int!
    ): Listings!
  }

  type Mutation {
    logIn(input: LogInInput): Viewer!
    logOut: Viewer!
    connectStripe(input: ConnectStripeInput!): Viewer!
    disconnectStripe: Viewer!
    hostListing(input: HostListingInput!): Listing!
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
    host: User!
    type: ListingType!
    country: String!
    admin: String!
    city: String!
    address: String!
    bookings(limit: Int!, page: Int!): Bookings
    bookingsIndex: String!
    price: Int!
    numOfGuests: Int!
  }

  type Listings {
    region: String
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

  enum ListingsFilter {
    PRICE_LOW_TO_HIGH
    PRICE_HIGH_TO_LOW
  }

  input LogInInput {
    code: String!
  }

  input ConnectStripeInput {
    code: String!
  }

  input HostListingInput {
    title: String!
    description: String!
    image: String!
    type: ListingType!
    address: String!
    price: Int!
    numOfGuests: Int!
  }
`
