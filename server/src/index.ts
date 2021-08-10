import 'dotenv/config'
import express, { Application } from 'express'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { typeDefs, resolvers } from './graphql'
import { connectDatabase } from './database'

const port = process.env.PORT

const startServer = async (app: Application) => {
  const db = await connectDatabase()
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ db }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  })
  await server.start()
  server.applyMiddleware({ app, path: '/api' })

  app.listen(port, () => {
    console.log(`[app-server]: http://localhost:${port}`)
  })
}

startServer(express())
