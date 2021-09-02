import 'dotenv/config'
import cors from 'cors'
import express, { Application } from 'express'
import cookieParser from 'cookie-parser'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { typeDefs, resolvers } from './graphql'
import { connectDatabase } from './database'

const port = process.env.PORT

const startServer = async (app: Application) => {
  app.use(cors({ origin: 'http://localhost:3000/', credentials: true }))
  const db = await connectDatabase()
  app.use(cookieParser(process.env.COOKIE_SECRET))
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

  app.get('/token', (req, res) => {
    console.log(req.headers['X-CSRF-TOKEN'])
    res.send('ok')
  })
}

startServer(express())
