import { Avatar, Divider, Typography, List } from 'antd'
import { Link } from 'react-router-dom'

import { Listing } from '../../../../lib/graphql/queries/Listing/__generated__/Listing'

interface Props {
  viewerIsNotListingHost: boolean
  listingBookings: Listing['listing']['bookings']
  limit: number
  bookingsPage: number
  setBookingsPage: (page: number) => void
}

const { Title, Text } = Typography

export const ListingBookings = ({
  viewerIsNotListingHost,
  listingBookings,
  limit,
  bookingsPage,
  setBookingsPage,
}: Props) => {
  const total = listingBookings ? listingBookings.total : null
  const result = listingBookings ? listingBookings.result : null

  const listingBookingsComponent = listingBookings ? (
    <List
      grid={{ gutter: 8, xs: 1, sm: 2, lg: 4 }}
      locale={{ emptyText: 'No Bookings have been made yet!' }}
      pagination={{
        current: bookingsPage,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        total: total ? total : undefined,
        onChange: (page: number) => setBookingsPage(page),
      }}
      dataSource={result ? result : undefined}
      renderItem={(listingBooking) => {
        const bookingHistory = (
          <div className='listing-bookings__history'>
            <div>
              Check in: <Text strong>{listingBooking.checkIn}</Text>
            </div>
            <div>
              Check out: <Text strong>{listingBooking.checkOut}</Text>
            </div>
          </div>
        )
        return (
          <List.Item className='listing-bookings__items'>
            {bookingHistory}
            <Link to={`/user/${listingBooking.tenant.id}`}>
              <Avatar
                src={listingBooking.tenant.avatar}
                size={64}
                shape='square'
              />
            </Link>
          </List.Item>
        )
      }}
    />
  ) : null

  const listingBookingsElement = listingBookingsComponent ? (
    <div className='listing-bookings'>
      <Divider />
      <div className='listing-bookings__section'>
        <Title level={4}>Bookings</Title>
      </div>
      {listingBookingsComponent}
    </div>
  ) : null

  return viewerIsNotListingHost ? null : listingBookingsElement
}
