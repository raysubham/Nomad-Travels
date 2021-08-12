import { Collection, ObjectId } from 'mongodb'

export interface BookingsIndex {
  [key: string]: BookingsIndexYear
}

export interface BookingsIndexYear {
  [key: string]: BookingsIndexMonth
}

export interface BookingsIndexMonth {
  [key: string]: boolean
}

export enum ListingType {
  Apartment = 'APARTMENT',
  House = 'HOUSE',
}

export interface Viewer {
  _id?: string
  token?: string
  avatar?: string
  hasWallet?: boolean
  didRequest: boolean
}

export interface Listing {
  _id: ObjectId
  title: string
  description: string
  image: string
  host: string
  type: ListingType
  city: string
  country: string
  address: string
  admin: string
  bookings: ObjectId[]
  bookingsIndex: BookingsIndex
  price: number
  numOfGuests: number
}
export interface User {
  _id: string
  token: string
  name: string
  email: string
  avatar: string
  walletId?: string
  income: number
  listings: ObjectId[]
  bookings: ObjectId[]
}
export interface Booking {
  _id: ObjectId
  listing: ObjectId
  tenant: string
  checkIn: string
  checkOut: string
}

export interface Database {
  listings: Collection<Listing>
  users: Collection<User>
  bookings: Collection<Booking>
}
