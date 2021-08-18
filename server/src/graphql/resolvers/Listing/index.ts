import { ObjectId } from 'mongodb'
import { Database, Listing } from '../../../lib/types'
import { ListingArgs } from './types'

export const listingResolvers = {
  Query: {
    listing: async (
      _root: undefined,
      { id }: ListingArgs,
      { db }: { db: Database }
    ): Promise<Listing> => {
      try {
        const listing = await db.listings.findOne({ _id: new ObjectId(id) })
        if (!listing) {
          throw new Error('Listing not found!')
        }
        return listing
      } catch (error) {
        throw new Error(`Failed to fetch listing: ${error}`)
      }
    },
  },
  Listing: {
    id: (listing: Listing): string => {
      return listing._id.toHexString()
    },
  },
}
