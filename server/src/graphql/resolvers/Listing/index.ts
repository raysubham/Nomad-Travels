import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { Cloudinary, Google } from '../../../lib/api'
import { Database, Listing, ListingType, User } from '../../../lib/types'
import { isAuthorized } from '../../../lib/utils'
import {
  HostListingArgs,
  HostListingInput,
  ListingArgs,
  ListingBookingsArgs,
  ListingBookingsData,
  ListingsArgs,
  ListingsData,
  ListingsFilter,
  ListingsQuery,
} from './types'

const verifyHostListingInput = ({
  title,
  description,
  price,
  type,
}: HostListingInput) => {
  if (title.length > 100) {
    throw new Error('Title must be less than 100 characters')
  }
  if (description.length > 500) {
    throw new Error('Description must be less than 5000 characters')
  }
  if (type !== ListingType.Apartment && type !== ListingType.House) {
    throw new Error('Listing Type must be either an Apartment or House')
  }
  if (price < 0) {
    throw new Error('Price must always be greater than 0')
  }
}

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
      { location, filter, limit, page }: ListingsArgs,
      { db }: { db: Database }
    ): Promise<ListingsData> => {
      try {
        const query: ListingsQuery = {}
        const listingsData: ListingsData = {
          region: null,
          total: 0,
          result: [],
        }

        if (location) {
          const { country, admin, city } = await Google.geocode(location)

          if (country) {
            query.country = country
          } else {
            throw new Error('No Country Found!')
          }

          if (admin) query.admin = admin
          if (city) query.city = city

          const cityText = city ? `${city}, ` : ''
          const adminText = admin ? `${admin}, ` : ''
          listingsData.region = `${cityText}${adminText}${country}`
        }

        let listingsCursor = await db.listings.find(query)

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
  Mutation: {
    hostListing: async (
      _root: undefined,
      { input }: HostListingArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<Listing | undefined> => {
      verifyHostListingInput(input)

      const viewer = await isAuthorized(db, req)
      if (!viewer) {
        throw new Error('Viewer cannot be found')
      }

      const { country, city, admin } = await Google.geocode(input.address)
      if (!country || !city || !admin) {
        throw new Error('invalid address input')
      }

      const imageUrl = await Cloudinary.upload(input.image)

      const insertedNewListing = await db.listings.insertOne({
        _id: new ObjectId(),
        ...input,
        image: imageUrl,
        bookings: [],
        bookingsIndex: {},
        country,
        admin,
        city,
        host: viewer._id,
      })

      if (insertedNewListing.insertedId) {
        await db.users.updateOne(
          {
            _id: viewer._id,
          },
          {
            $push: {
              listings: insertedNewListing.insertedId,
            },
          }
        )
      }

      const newListing = await db.listings.findOne({
        _id: insertedNewListing.insertedId,
      })

      return newListing
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
