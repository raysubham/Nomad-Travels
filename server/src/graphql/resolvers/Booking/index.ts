import { Booking, Database, Listing } from '../../../lib/types'

export const bookingResolvers = {
  Booking: {
    id: (booking: Booking): string => {
      return booking._id.toHexString()
    },
    listing: (
      booking: Booking,
      _args: Record<string, never>,
      { db }: { db: Database }
    ): Promise<Listing | undefined> => {
      return db.listings.findOne({ _id: booking.listing })
    },
  },
}
