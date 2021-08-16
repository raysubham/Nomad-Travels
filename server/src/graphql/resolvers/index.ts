import merge from 'lodash.merge'

import { UserResolvers } from './User'
import { ViewerResolvers } from './Viewer'

export const resolvers = merge(UserResolvers, ViewerResolvers)
