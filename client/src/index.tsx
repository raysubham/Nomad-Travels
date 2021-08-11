import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './styles/index.css'
import reportWebVitals from './reportWebVitals'
import { Home, Host, Listing, Listings, NotFound, User } from './modules'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import './styles/index.css'

const client = new ApolloClient({
  uri: '/api',
  cache: new InMemoryCache(),
})

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/host' component={Host} />
        <Route exact path='/listing/:id' component={Listing} />
        <Route exact path='/listings/:location?' component={Listings} />
        <Route exact path='/user/:id' component={User} />
        <Route component={NotFound} />
      </Switch>
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

reportWebVitals(console.log)
