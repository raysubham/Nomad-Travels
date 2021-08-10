import { ObjectId } from 'mongodb'
import { Database, Listing } from '../../../lib/types'

export const listingResolvers = {
  Query: {
    listings: async (
      _root: undefined,
      _args: Record<string, never>,
      { db }: { db: Database }
    ): Promise<Listing[]> => {
      return await db.listings.find({}).toArray()
    },
  },
  Mutation: {
    deleteListing: async (
      _root: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<Listing> => {
      const deleteRes = await db.listings.findOneAndDelete({
        _id: new ObjectId(id),
      })

      if (!deleteRes.value) {
        throw new Error('Already deleted!')
      }

      return deleteRes.value
    },
  },
  Listing: {
    id: (listing: Listing): string => listing._id.toHexString(),
  },
}
