// import { Request } from 'express'
// import { Database, User } from '../types'

// export const authorize = async (
//   db: Database,
//   req: Request
// ): Promise<User | null> => {
//   const token: string | undefined = req.get('X-CSRF-TOKEN')
//     ? req.get('X-CSRF-TOKEN')
//     : ''
//   const viewerId: string | null = req.signedCookies.viewer
//     ? req.signedCookies.viewer
//     : ''

//   const viewer = await db.users.findOne({
//     _id: viewerId,
//     token,
//   })

//   return viewer
// }

import { Request } from 'express'
import { Database, User } from '../types'

export const authorize = async (
  db: Database,
  req: Request
): Promise<User | undefined> => {
  const token = req.get('X-CSRF-TOKEN')
  const viewerId = req.signedCookies.viewer

  const viewer = await db.users.findOne({ _id: { viewerId }, token })

  return viewer
}
