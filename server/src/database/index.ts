import { MongoClient } from 'mongodb'
import { Database } from '../lib/types'

const url = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.otx5o.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

export const connectDatabase = async (): Promise<Database> => {
  const client = await MongoClient.connect(url as string)

  const db = client.db('nomad-db')

  return {
    listings: db.collection('listings'),
  }
}
