import { useQuery } from '@apollo/client'
import { Col, Layout, Row } from 'antd'
import { Moment } from 'moment'

import { useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { ErrorBanner, PageSkeleton } from '../../lib/components'
import { LISTING } from '../../lib/graphql/queries'
import {
  Listing as ListingData,
  ListingVariables,
} from '../../lib/graphql/queries/Listing/__generated__/Listing'
import { Viewer } from '../../lib/types'
import {
  ListingBookings,
  ListingCreateBooking,
  ListingDetails,
} from './components'

interface MatchParams {
  id: string
}

interface Props {
  viewer: Viewer
}

const { Content } = Layout
const PAGE_LIMIT = 4

export const Listing = ({
  match,
  viewer,
}: Props & RouteComponentProps<MatchParams>) => {
  const [bookingsPage, setBookingsPage] = useState(1)
  const [checkInDate, setCheckInDate] = useState<Moment | null>(null)
  const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null)

  const { data, loading, error } = useQuery<ListingData, ListingVariables>(
    LISTING,
    {
      variables: {
        id: match.params.id,
        limit: PAGE_LIMIT,
        bookingsPage,
      },
    }
  )

  if (loading) {
    return (
      <Content className='listings'>
        <PageSkeleton />
      </Content>
    )
  }
  if (error) {
    return (
      <Content className='listings'>
        <ErrorBanner description='This Listing does not exist!' />
        <PageSkeleton />
      </Content>
    )
  }

  const listing = data ? data.listing : null
  const listingBookings = listing ? listing.bookings : null

  const viewerIsNotListingHost = viewer.id !== listing?.host.id

  const listingDetailsElement = listing ? (
    <ListingDetails listing={listing} />
  ) : null

  const listingBookingsElement = listingBookings ? (
    <ListingBookings
      viewerIsNotListingHost={viewerIsNotListingHost}
      listingBookings={listingBookings}
      limit={PAGE_LIMIT}
      bookingsPage={bookingsPage}
      setBookingsPage={setBookingsPage}
    />
  ) : null

  const listingCreateBookingElement = listing ? (
    <ListingCreateBooking
      viewer={viewer}
      host={listing.host}
      price={listing.price}
      bookingsIndex={listing.bookingsIndex}
      checkInDate={checkInDate}
      setCheckInDate={setCheckInDate}
      checkOutDate={checkOutDate}
      setCheckOutDate={setCheckOutDate}
    />
  ) : null

  return (
    <Content className='listing-page'>
      <Row gutter={24} justify='space-between'>
        <Col xs={24} lg={15}>
          {listingDetailsElement}
          {listingBookingsElement}
        </Col>
        <Col xs={24} lg={9}>
          {listingCreateBookingElement}
        </Col>
      </Row>
    </Content>
  )
}
