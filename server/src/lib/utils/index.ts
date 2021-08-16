import { Request } from 'express'
import { Database, User } from '../types'

export const authorizedUser = async (
  db: Database,
  req: Request
): Promise<User | undefined> => {
  const token = req.get('X-CSRF-TOKEN') as string
  const viewerId = (await req.signedCookies.viewer) as string

  const viewer = await db.users.findOne({
    _id: viewerId,
    token,
  })
  return viewer
}
