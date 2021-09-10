import { ObjectId } from 'mongodb'
import { Request } from 'express'
import {
  Booking,
  BookingsIndex,
  Database,
  Listing,
  User,
} from '../../../lib/types'
import { isAuthorized } from '../../../lib/utils'
import { CreateBookingArgs } from './types'
import { Stripe } from '../../../lib/api'

const resolveBookingsIndex = (
  bookingsIndex: BookingsIndex,
  checkInDate: string,
  checkOutDate: string
): BookingsIndex => {
  let dateCursor = new Date(checkInDate)
  const checkOut = new Date(checkOutDate)

  const newBookingsIndex: BookingsIndex = { ...bookingsIndex }

  while (dateCursor <= checkOut) {
    const year = dateCursor.getUTCFullYear()
    const month = dateCursor.getUTCMonth()
    const day = dateCursor.getUTCDate()

    if (!newBookingsIndex[year]) {
      newBookingsIndex[year] = {}
    }

    if (!newBookingsIndex[year][month]) {
      newBookingsIndex[year][month] = {}
    }

    if (!newBookingsIndex[year][month][day]) {
      newBookingsIndex[year][month][day] = true
    } else {
      throw new Error('Selected checkIn date is already booked!')
    }

    dateCursor = new Date(dateCursor.getTime() + 86400000)
  }

  return newBookingsIndex
}

export const bookingResolvers = {
  Mutation: {
    createBooking: async (
      _root: undefined,
      { input }: CreateBookingArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<Booking | undefined> => {
      const { id, source, checkIn, checkOut } = input

      const viewer = await isAuthorized(db, req)
      if (!viewer) {
        throw new Error('Viewer cannot be found!')
      }

      const listing = await db.listings.findOne({
        _id: new ObjectId(id),
      })
      if (!listing) {
        throw new Error('Listing cannot be found!')
      }

      if (listing.host === viewer._id) {
        throw new Error('Viewer cannot host own listing!')
      }

      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)

      if (checkInDate > checkOutDate) {
        throw new Error('CheckIn date cannot be before CheckOut date!')
      }

      const bookingsIndex = resolveBookingsIndex(
        listing.bookingsIndex,
        checkIn,
        checkOut
      )

      const totalPrice =
        listing.price *
        ((checkOutDate.getTime() - checkInDate.getTime()) / 86400000 + 1) *
        100

      const host = await db.users.findOne({
        _id: listing.host,
      })
      if (!host) {
        throw new Error('Host cannot be found!')
      }
      if (!host.walletId) {
        throw new Error('Host is not connected to Stripe!')
      }

      await Stripe.charge(totalPrice, source, host.walletId)

      const insertedNewBooking = await db.bookings.insertOne({
        _id: new ObjectId(),
        listing: listing._id,
        tenant: viewer._id,
        checkIn,
        checkOut,
      })

      const booking: Booking | undefined = await db.bookings.findOne({
        _id: insertedNewBooking.insertedId,
      })

      await db.users.updateOne(
        {
          _id: host._id,
        },
        {
          $inc: {
            income: totalPrice,
          },
        }
      )

      await db.users.updateOne(
        {
          _id: viewer._id,
        },
        {
          $push: { bookings: insertedNewBooking.insertedId },
        }
      )

      await db.listings.updateOne(
        {
          _id: listing._id,
        },
        {
          $set: { bookingsIndex },
          $push: { bookings: insertedNewBooking.insertedId },
        }
      )

      return booking
    },
  },
  Booking: {
    id: (booking: Booking): string => {
      return booking._id.toHexString()
    },
    listing: async (
      booking: Booking,
      _args: Record<string, never>,
      { db }: { db: Database }
    ): Promise<Listing | undefined> => {
      return await db.listings.findOne({ _id: booking.listing })
    },
    tenant: async (
      booking: Booking,
      _args: Record<string, never>,
      { db }: { db: Database }
    ): Promise<User | undefined> => {
      return await db.users.findOne({ _id: booking.tenant })
    },
  },
}
