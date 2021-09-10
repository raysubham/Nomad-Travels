import { useQuery } from '@apollo/client'
import { Col, Layout, Row } from 'antd'
import { useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { ErrorBanner, PageSkeleton } from '../../lib/components'
import { USER } from '../../lib/graphql/queries'
import {
  User as UserData,
  UserVariables,
} from '../../lib/graphql/queries/User/__generated__/User'
import { useScrollToTop } from '../../lib/hooks'
import { Viewer } from '../../lib/types'
import { UserBookings, UserListings, UserProfile } from './components'

const { Content } = Layout

interface Props {
  viewer: Viewer
  setViewer: (viewer: Viewer) => void
}

interface MatchParams {
  id: string
}

const PAGE_LIMIT = 4

export const User = ({
  viewer,
  setViewer,
  match,
}: Props & RouteComponentProps<MatchParams>) => {
  useScrollToTop()

  const [listingsPage, setListingsPage] = useState(1)
  const [bookingsPage, setBookingsPage] = useState(1)

  const { data, loading, error, refetch } = useQuery<UserData, UserVariables>(
    USER,
    {
      variables: {
        id: match.params.id,
        listingsPage,
        bookingsPage,
        limit: PAGE_LIMIT,
      },
      fetchPolicy: 'cache-and-network',
    }
  )

  const handleRefetchUser = async () => await refetch()

  const user = data ? data.user : null
  const viewerIsUser = viewer.id === match.params.id

  const showName = user?.name.split(' ')[0]
  const userName = viewerIsUser ? 'Your' : `${showName}'s`

  const userListings = user ? user.listings : null
  const userBookings = user ? user.bookings : null

  const stripeError = new URLSearchParams(window.location.search).get(
    'stripe_error'
  )

  const stripeErrorElement = stripeError ? (
    <ErrorBanner description='We had an issue connecting with stripe. Please try again later...' />
  ) : null

  const userProfileElement = user ? (
    <UserProfile
      user={user}
      viewerIsUser={viewerIsUser}
      viewer={viewer}
      setViewer={setViewer}
      handleRefetchUser={handleRefetchUser}
    />
  ) : null

  const userListingsElement = userListings ? (
    <UserListings
      userName={userName}
      userListings={userListings}
      listingsPage={listingsPage}
      setListingsPage={setListingsPage}
      limit={PAGE_LIMIT}
    />
  ) : null

  const userBookingsElement = userBookings ? (
    <UserBookings
      viewerIsUser={viewerIsUser}
      userBookings={userBookings}
      bookingsPage={bookingsPage}
      setBookingsPage={setBookingsPage}
      limit={PAGE_LIMIT}
    />
  ) : null

  if (loading) {
    return (
      <Content className='user'>
        <PageSkeleton />
      </Content>
    )
  }

  if (error) {
    return (
      <Content className='user'>
        <ErrorBanner description="The user doesn't exists or we have encountered an error. Please try again later!" />
        <PageSkeleton />
      </Content>
    )
  }

  return (
    <Content className='user'>
      {stripeErrorElement}
      <Row gutter={12} justify='space-between'>
        <Col xs={24}>{userProfileElement}</Col>
        <Col xs={24}>
          {userListingsElement}
          {userBookingsElement}
        </Col>
      </Row>
    </Content>
  )
}
