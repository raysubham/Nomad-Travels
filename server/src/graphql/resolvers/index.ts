import merge from 'lodash.merge'

import { UserResolvers } from './User'
import { ViewerResolvers } from './Viewer'
import { listingResolvers } from './Listing'
import { bookingResolvers } from './Booking'

export const resolvers = merge(
  UserResolvers,
  ViewerResolvers,
  listingResolvers,
  bookingResolvers
)
