import { useQuery } from '@apollo/client'
import { Affix, Layout, List, Typography } from 'antd'
import { useEffect, useRef, useState } from 'react'

import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { ErrorBanner, ListingCard } from '../../lib/components'
import { ListingsFilter } from '../../lib/graphql/globalTypes'
import { LISTINGS } from '../../lib/graphql/queries'
import {
  Listings as ListingsData,
  ListingsVariables,
} from '../../lib/graphql/queries/Listings/__generated__/Listings'
import { useScrollToTop } from '../../lib/hooks'
import {
  ListingsFilterComponent,
  ListingsPagination,
  ListingsSkeleton,
} from './components'

const { Content } = Layout
const { Title, Text, Paragraph } = Typography
const PAGE_LIMIT = 8

interface MatchParams {
  location: string
}

export const Listings = ({ match }: RouteComponentProps<MatchParams>) => {
  useScrollToTop()

  const locationref = useRef(match.params.location)
  const [filter, setFilter] = useState(ListingsFilter.PRICE_LOW_TO_HIGH)
  const [page, setPage] = useState(1)
  const { data, loading, error } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      skip: locationref.current !== match.params.location && page !== 1,
      variables: {
        location: match.params.location,
        filter,
        limit: PAGE_LIMIT,
        page,
      },
    }
  )

  const listings = data ? data.listings : null
  const listingsRegion = listings ? listings.region : null

  useEffect(() => {
    setPage(1)
    locationref.current = match.params.location
  }, [match.params.location])

  if (loading) {
    return (
      <Content className='listings'>
        <ListingsSkeleton />
      </Content>
    )
  }
  if (error) {
    return (
      <Content className='listings'>
        <ErrorBanner
          description={`We either couldn't find your destination or we have encountered an error. Please try again later with a more appropiate searchterm!`}
        />
        <ListingsSkeleton />
      </Content>
    )
  }

  const listingsSectionElement =
    listings && listings.result.length ? (
      <div>
        <Affix offsetTop={64}>
          <ListingsPagination
            total={listings.total}
            limit={PAGE_LIMIT}
            page={page}
            setPage={setPage}
          />
          <ListingsFilterComponent filter={filter} setFilter={setFilter} />
        </Affix>
        <List
          grid={{ gutter: 8, xs: 1, sm: 2, lg: 4 }}
          dataSource={listings.result}
          renderItem={(listing) => (
            <List.Item>
              <ListingCard listing={listing} />
            </List.Item>
          )}
        />
      </div>
    ) : (
      <div>
        <Paragraph>
          No Listings found for <Text mark>"{listingsRegion}"</Text>
        </Paragraph>
        <Paragraph>
          Be the first person to create a{' '}
          <Link to='/host'>listing in this area</Link>
        </Paragraph>
      </div>
    )

  const listingsRegionElement = listingsRegion ? (
    <Title level={3} className='listings__title'>
      All available results for "{listingsRegion}"
    </Title>
  ) : null

  return (
    <Content className='listings'>
      {listingsRegionElement}
      {listingsSectionElement}
    </Content>
  )
}
