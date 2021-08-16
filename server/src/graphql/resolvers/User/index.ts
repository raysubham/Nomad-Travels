import { Request } from 'express'
import { Database, User } from '../../../lib/types'
import { authorizedUser } from '../../../lib/utils'
import {
  UserArgs,
  UserBookingsArgs,
  UserBookingsData,
  UserListingsArgs,
  UserListingsData,
} from './types'

export const UserResolvers = {
  Query: {
    user: async (
      _root: undefined,
      { id }: UserArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<User> => {
      try {
        const user = await db.users.findOne({ _id: id })
        if (!user) {
          throw new Error('User not found')
        }

        const viewer = await authorizedUser(db, req)

        if (viewer && viewer._id === user._id) {
          user.authorized = true
        }
        return user
      } catch (error) {
        throw new Error(`Failed to get the user: ${error}`)
      }
    },
  },
  User: {
    id: (user: User): string => {
      return user._id
    },
    hasWallet: (user: User): boolean => {
      return Boolean(user.walletId)
    },
    income: (user: User): number | null => {
      return user.authorized ? user.income : null
    },
    bookings: async (
      user: User,
      { limit, page }: UserBookingsArgs,
      { db }: { db: Database }
    ): Promise<UserBookingsData | null> => {
      try {
        if (!user.authorized) {
          return null
        }

        const data: UserBookingsData = { total: 0, result: [] }

        const bookingsCursor = db.bookings.find({
          _id: { $in: user.bookings },
        })

        bookingsCursor.skip(page > 0 ? (page - 1) * limit : 0)
        bookingsCursor.limit(limit)

        data.total = await bookingsCursor.count()
        data.result = await bookingsCursor.toArray()

        return data
      } catch (error) {
        throw new Error(`Failed to query user bookings: ${error}`)
      }
    },
    listings: async (
      user: User,
      { limit, page }: UserListingsArgs,
      { db }: { db: Database }
    ): Promise<UserListingsData | null> => {
      try {
        const data: UserListingsData = { total: 0, result: [] }

        const listingsCursor = db.bookings.find({
          _id: { $in: user.listings },
        })

        listingsCursor.skip(page > 0 ? (page - 1) * limit : 0)
        listingsCursor.limit(limit)

        data.total = await listingsCursor.count()
        data.result = await listingsCursor.toArray()

        return data
      } catch (error) {
        throw new Error(`Failed to query user listings: ${error}`)
      }
    },
  },
}
