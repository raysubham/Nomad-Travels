import React, { useEffect, useRef, useState } from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './styles/index.css'
// import reportWebVitals from './reportWebVitals'
import {
  AppHeader,
  Home,
  Host,
  Listing,
  Listings,
  NotFound,
  User,
  Login,
  Stripe,
} from './modules'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useMutation,
  ApolloLink,
  HttpLink,
  concat,
} from '@apollo/client'
import './styles/index.css'
import { Affix, Layout, Spin } from 'antd'
import { Viewer } from './lib/types'
import { LOG_IN } from './lib/graphql/mutations'
import {
  LogIn as LogInData,
  LogInVariables,
} from './lib/graphql/mutations/LogIn/__generated__/LogIn'
import { AppHeaderSkeleton, ErrorBanner } from './lib/components'

const httpLink = new HttpLink({ uri: '/api' })

const tokenMiddleware = new ApolloLink((operation, forward) => {
  const token = sessionStorage.getItem('token')
  console.log(token)

  operation.setContext(async () => ({
    headers: {
      'X-CSRF-TOKEN': token || 'heloooooooooo',
    },
  }))

  return forward(operation)
})

const client = new ApolloClient({
  link: concat(tokenMiddleware, httpLink),
  cache: new InMemoryCache(),
})

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
}

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer)

  const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn)

        if (data.logIn.token) {
          sessionStorage.setItem('token', data.logIn.token)
        } else {
          sessionStorage.removeItem('token')
        }
      }
    },
  })

  const logInRef = useRef(logIn)

  useEffect(() => {
    logInRef.current()
  }, [])

  if (!viewer.didRequest && !error) {
    return (
      <Layout className='app-skeleton'>
        <AppHeaderSkeleton />
        <div className='app-skeleton__spin-section'>
          <Spin
            style={{ color: 'var(--gamma' }}
            size='large'
            tip='Launching Nomad Travels'
          />
        </div>
      </Layout>
    )
  }

  const logInErrorBanner = error ? (
    <ErrorBanner description="Oops! We couldn't verify you. Please Try Again Later" />
  ) : undefined

  return (
    <Router>
      <Layout id='app'>
        {logInErrorBanner}
        <Affix offsetTop={0} className='app__affix-header'>
          <AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/host' component={Host} />
          <Route exact path='/listing/:id' component={Listing} />
          <Route exact path='/listings/:location?' component={Listings} />
          <Route
            exact
            path='/user/:id'
            render={(props) => (
              <User {...props} viewer={viewer} setViewer={setViewer} />
            )}
          />
          <Route
            exact
            path='/login'
            render={(props) => <Login {...props} setViewer={setViewer} />}
          />
          <Route
            exact
            path='/stripe'
            render={(props) => (
              <Stripe {...props} viewer={viewer} setViewer={setViewer} />
            )}
          />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  )
}

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('main')
)

// reportWebVitals(console.log)
