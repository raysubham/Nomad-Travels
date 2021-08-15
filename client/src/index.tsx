import React, { useState } from 'react'
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
} from './modules'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import './styles/index.css'
import { Affix, Layout } from 'antd'
import { Viewer } from './lib/types'

const client = new ApolloClient({
  uri: '/api',
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

  console.log(viewer)

  return (
    <Router>
      <Layout id='app'>
        <Affix offsetTop={0} className='app__affix-header'>
          <AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/host' component={Host} />
          <Route exact path='/listing/:id' component={Listing} />
          <Route exact path='/listings/:location?' component={Listings} />
          <Route exact path='/user/:id' component={User} />
          <Route
            exact
            path='/login'
            render={(props) => <Login {...props} setViewer={setViewer} />}
          />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  )
}

render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('main')
)

// reportWebVitals(console.log)
