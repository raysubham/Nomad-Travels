import React from 'react'
import { render } from 'react-dom'
import './index.css'
import reportWebVitals from './reportWebVitals'
import { ListingsComponent } from './sections/Listings'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import './styles/index.css'

const client = new ApolloClient({
  uri: '/api',
  cache: new InMemoryCache(),
})

render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ListingsComponent title='All Listings' />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('main')
)

reportWebVitals(console.log)
