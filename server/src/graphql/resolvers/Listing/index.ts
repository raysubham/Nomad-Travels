import { ObjectId } from 'mongodb'
import { Database, Listing, User } from '../../../lib/types'
import {
  ListingArgs,
  ListingBookingsArgs,
  ListingBookingsData,
  ListingsArgs,
  ListingsData,
  ListingsFilter,
} from './types'

export const listingResolvers = {
  Query: {
    listing: async (
      _root: undefined,
      { id }: ListingArgs,
      { db }: { db: Database }
    ): Promise<Listing> => {
      try {
        const listing = await db.listings.findOne({ _id: new ObjectId(id) })

        // const viewer = await isAuthorized(db, req)
        // if (viewer && viewer._id === listing?.host){
        //   listing.authorized=true
        // }

        if (!listing) {
          throw new Error('Listing not found!')
        }
        return listing
      } catch (error) {
        throw new Error(`Failed to fetch listing: ${error}`)
      }
    },
    listings: async (
      _root: undefined,
      { filter, limit, page }: ListingsArgs,
      { db }: { db: Database }
    ): Promise<ListingsData> => {
      try {
        const listingsData: ListingsData = {
          total: 0,
          result: [],
        }
        let listingsCursor = await db.listings.find({})

        listingsData.total = await listingsCursor.count()

        if (filter && filter === ListingsFilter.PRICE_LOW_TO_HIGH) {
          listingsCursor = listingsCursor.sort({ price: 1 })
        }
        if (filter && filter === ListingsFilter.PRICE_HIGH_TO_LOW) {
          listingsCursor = listingsCursor.sort({ price: -1 })
        }

        listingsCursor = listingsCursor.skip(page > 0 ? (page - 1) * limit : 0)
        listingsCursor = listingsCursor.limit(limit)

        listingsData.result = await listingsCursor.toArray()

        return listingsData
      } catch (error) {
        throw new Error(`Failed to fetch listings:${error}`)
      }
    },
  },
  Listing: {
    id: (listing: Listing): string => {
      return listing._id.toHexString()
    },
    host: async (
      listing: Listing,
      _args: Record<string, never>,
      { db }: { db: Database }
    ): Promise<User> => {
      const host = await db.users.findOne({ _id: listing.host })
      if (!host) {
        throw new Error('host not found!')
      }
      return host
    },
    bookingsIndex: (listing: Listing): string => {
      return JSON.stringify(listing.bookingsIndex)
    },
    bookings: async (
      listing: Listing,
      { limit, page }: ListingBookingsArgs,
      { db }: { db: Database }
    ): Promise<ListingBookingsData | null> => {
      try {
        // if (!listing.authorized) {
        //   return null
        // }

        const data: ListingBookingsData = { total: 0, result: [] }

        let bookingsCursor = db.bookings.find({
          _id: { $in: listing.bookings },
        })

        data.total = await bookingsCursor.count()

        bookingsCursor = bookingsCursor.skip(page > 0 ? (page - 1) * limit : 0)
        bookingsCursor = bookingsCursor.limit(limit)

        data.result = await bookingsCursor.toArray()

        return data
      } catch (error) {
        throw new Error(`Failed to fetch this listing's bookings: ${error}`)
      }
    },
  },
}
