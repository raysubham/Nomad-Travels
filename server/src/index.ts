// import 'dotenv/config'
import express, { Application } from 'express'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { typeDefs, resolvers } from './graphql'
import { connectDatabase } from './database'

const port = process.env.PORT

const startServer = async (app: Application) => {
  const db = await connectDatabase()
  app.use(express.json({ limit: '2mb' }))
  app.use(cookieParser(process.env.COOKIE_SECRET))
  app.use(compression())

  app.use(express.static(`${__dirname}/client`))
  app.get('/*', (_req, res) => res.sendFile(`${__dirname}/client/index.html`))

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  })
  await server.start()
  server.applyMiddleware({ app, path: '/api' })

  app.listen(port, () => {
    console.log(`[app-server]: http://localhost:${port}`)
  })
}

startServer(express())
