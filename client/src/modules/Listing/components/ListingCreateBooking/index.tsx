import { Button, DatePicker, Card, Divider, Typography, Tooltip } from 'antd'
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
  setModalVisible: (modalVisible: boolean) => void
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
  setModalVisible,
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

      const dateIsMoreThanThreeMonthsAhead = moment(currentDate).isAfter(
        moment().endOf('day').add(90, 'days')
      )
      return (
        currentDateIsBeforeEndOfToday ||
        dateIsMoreThanThreeMonthsAhead ||
        dateIsBooked(currentDate)
      )
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
              renderExtraFooter={() => {
                return (
                  <div>
                    <Text type='secondary' className='ant-calnder-footer-text'>
                      You can only book a listing within 90 days from today.
                    </Text>
                  </div>
                )
              }}
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
              renderExtraFooter={() => {
                return (
                  <div>
                    <Text type='secondary' className='ant-calnder-footer-text'>
                      Check-out cannot be before check-in.
                    </Text>
                  </div>
                )
              }}
              dateRender={(current) => {
                if (
                  moment(current).isSame(
                    checkInDate ? checkInDate : undefined,
                    'day'
                  )
                ) {
                  return (
                    <Tooltip title='Check in date'>
                      <div className='ant-calendar-date ant-calendar-date__check-in'>
                        {current.date()}
                      </div>
                    </Tooltip>
                  )
                } else {
                  return (
                    <div className='ant-calendar-date'>{current.date()}</div>
                  )
                }
              }}
            />
          </div>
        </div>
        <Divider />
        <Button
          disabled={buttonDisabled}
          type='primary'
          size='large'
          className='listing-booking__card-cta'
          onClick={() => setModalVisible(true)}>
          Request to book
        </Button>
        <Text type='secondary' mark>
          {buttonMessage}
        </Text>
      </Card>
    </div>
  )
}
