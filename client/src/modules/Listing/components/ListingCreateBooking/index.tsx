import { Button, DatePicker, Card, Divider, Typography } from 'antd'
import moment, { Moment } from 'moment'
import { Listing as ListingData } from '../../../../lib/graphql/queries/Listing/__generated__/Listing'
import { Viewer } from '../../../../lib/types'
import { displayErrorMessage } from '../../../../lib/utils'
import { BookingsIndex } from './types'

interface Props {
  viewer: Viewer
  host: ListingData['listing']['host']
  bookingsIndex: ListingData['listing']['bookingsIndex']
  price: number
  checkInDate: Moment | null
  checkOutDate: Moment | null
  setCheckInDate: (checkInDate: Moment | null) => void
  setCheckOutDate: (checkOutDate: Moment | null) => void
}

const { Paragraph, Title, Text } = Typography

export const ListingCreateBooking = ({
  viewer,
  host,
  bookingsIndex,
  price,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
}: Props) => {
  const bookingsIndexJSON: BookingsIndex = JSON.parse(bookingsIndex)

  const dateIsBooked = (currentDate: Moment) => {
    const year = moment(currentDate).year()
    const month = moment(currentDate).month()
    const day = moment(currentDate).date()

    if (bookingsIndexJSON[year] && bookingsIndexJSON[year][month]) {
      return Boolean(bookingsIndexJSON[year][month][day])
    } else {
      return false
    }
  }

  const disabledDate = (currentDate: Moment) => {
    if (currentDate) {
      const currentDateIsBeforeEndOfToday = currentDate.isBefore(
        moment().endOf('day')
      )
      return currentDateIsBeforeEndOfToday || dateIsBooked(currentDate)
    } else {
      return false
    }
  }

  const verifyAndSetCheckOutDate = (selectedCheckOutDate: Moment | null) => {
    if (checkInDate && selectedCheckOutDate) {
      if (moment(selectedCheckOutDate).isBefore(checkInDate, 'days')) {
        return displayErrorMessage(
          `Oops! You can't book any date prior to checkin date!`
        )
      }

      let dateCursor = checkInDate

      while (moment(dateCursor).isBefore(selectedCheckOutDate, 'days')) {
        dateCursor = moment(dateCursor).add(1, 'days')

        const year = moment(dateCursor).year()
        const month = moment(dateCursor).month()
        const day = moment(dateCursor).date()

        if (
          bookingsIndexJSON[year] &&
          bookingsIndexJSON[year][month] &&
          bookingsIndexJSON[year][month][day]
        ) {
          return displayErrorMessage(
            'You cannot book a period of time that overlaps with existing bookings! Please try again later!'
          )
        }
      }
    }
    setCheckOutDate(selectedCheckOutDate)
  }

  const viewerIsHost = viewer.id === host.id

  const checkInInputDisabled = !viewer.id || viewerIsHost || !host.hasWallet
  const checkOutInputDisabled = checkInInputDisabled || !checkInDate
  const buttonDisabled = checkOutInputDisabled || !checkInDate || !checkOutDate

  let buttonMessage = `You won't be charged yet`

  if (!viewer.id) {
    buttonMessage = `You have to be signed in to book a listing!`
  } else if (viewerIsHost) {
    buttonMessage = `You can't book your own listing!`
  } else if (!host.hasWallet) {
    buttonMessage = `The host has disconnected from Stripe and thus won't be receiving any payments!`
  }

  return (
    <div className='listing-booking'>
      <Card className='listing-booking__card'>
        <div>
          <Paragraph>
            <Title className='listing-booking__card-title' level={2}>
              ₹ {price} <span>/ day</span>
            </Title>
          </Paragraph>
          <Divider />
          <div className='listing-booking__card-date-picker'>
            <Paragraph strong>Check In</Paragraph>
            <DatePicker
              value={checkInDate ? checkInDate : undefined}
              onChange={(newDateValue) => setCheckInDate(newDateValue)}
              format={'DD/MM/YYYY'}
              disabled={checkInInputDisabled}
              disabledDate={disabledDate}
              showToday={false}
              onOpenChange={() => setCheckOutDate(null)}
            />
          </div>
          <div className='listing-booking__card-date-picker'>
            <Paragraph strong>Check Out</Paragraph>
            <DatePicker
              value={checkOutDate ? checkOutDate : undefined}
              onChange={(newDateValue) =>
                verifyAndSetCheckOutDate(newDateValue)
              }
              format={'DD/MM/YYYY'}
              disabledDate={disabledDate}
              showToday={false}
              disabled={checkOutInputDisabled}
            />
          </div>
        </div>
        <Divider />
        <Button
          disabled={buttonDisabled}
          type='primary'
          size='large'
          className='listing-booking__card-cta'>
          Request to book
        </Button>
        <Text type='secondary' mark>
          {buttonMessage}
        </Text>
      </Card>
    </div>
  )
}
