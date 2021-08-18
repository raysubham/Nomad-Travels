import { Typography, List } from 'antd'
import { ListingCard } from '../../../../lib/components'
import { User } from '../../../../lib/graphql/queries/User/__generated__/User'

interface Props {
  userBookings: User['user']['bookings']
  limit: number
  bookingsPage: number
  setBookingsPage: (page: number) => void
  viewerIsUser: boolean
}

const { Paragraph, Title, Text } = Typography

export const UserBookings = ({
  userBookings,
  limit,
  bookingsPage,
  setBookingsPage,
  viewerIsUser,
}: Props) => {
  const total = userBookings ? userBookings.total : null
  const result = userBookings ? userBookings.result : null

  const userBookingsComponent = userBookings ? (
    <List
      grid={{ gutter: 8, xs: 1, sm: 2, lg: 4 }}
      locale={{ emptyText: 'No Bookings Found!' }}
      pagination={{
        position: 'top',
        current: bookingsPage,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        total: total ? total : undefined,
        onChange: (page: number) => setBookingsPage(page),
      }}
      dataSource={result ? result : undefined}
      renderItem={(userBooking) => {
        const bookingHistory = (
          <div className='user-bookings__booking-history'>
            <div>
              Check in: <Text strong>{userBooking.checkIn}</Text>
            </div>
            <div>
              Check out: <Text strong>{userBooking.checkOut}</Text>
            </div>
          </div>
        )
        return (
          <List.Item>
            {bookingHistory}
            <ListingCard listing={userBooking.listing} />
          </List.Item>
        )
      }}
    />
  ) : null

  const userBookingsElement = userBookingsComponent ? (
    <div className='user-bookings'>
      <Title level={4} className='user-bookings__title'>
        Your Bookings
      </Title>
      <Paragraph className='user-bookings__paragraph'>
        All your bookings in one place
      </Paragraph>
      {userBookingsComponent}
    </div>
  ) : null

  return viewerIsUser ? userBookingsElement : null
}
