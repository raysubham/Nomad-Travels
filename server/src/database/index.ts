import { MongoClient } from 'mongodb'
import { Booking, Database, Listing, User } from '../lib/types'

const url = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.otx5o.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

export const connectDatabase = async (): Promise<Database> => {
  const client = await MongoClient.connect(url as string)

  const db = client.db(process.env.DB_NAME)

  return {
    listings: db.collection<Listing>('listings'),
    users: db.collection<User>('users'),
    bookings: db.collection<Booking>('bookings'),
  }
}
