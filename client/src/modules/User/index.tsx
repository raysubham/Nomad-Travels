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
import { Viewer } from '../../lib/types'
import { UserBookings, UserListings, UserProfile } from './components'

const { Content } = Layout

interface Props {
  viewer: Viewer
}

interface MatchParams {
  id: string
}

const PAGE_LIMIT = 4

export const User = ({
  viewer,
  match,
}: Props & RouteComponentProps<MatchParams>) => {
  const [listingsPage, setListingsPage] = useState(1)
  const [bookingsPage, setBookingsPage] = useState(1)

  const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
    variables: {
      id: match.params.id,
      listingsPage,
      bookingsPage,
      limit: PAGE_LIMIT,
    },
  })

  const user = data ? data.user : null
  const viewerIsUser = viewer.id === match.params.id

  const showName = user?.name.split(' ')[0]
  const userName = viewerIsUser ? 'Your' : `${showName}'s`

  const userListings = user ? user.listings : null
  const userBookings = user ? user.bookings : null

  const userProfileElement = user ? (
    <UserProfile user={user} viewerIsUser={viewerIsUser} />
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
