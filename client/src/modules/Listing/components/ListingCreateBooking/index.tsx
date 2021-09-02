import { Button, DatePicker, Card, Divider, Typography } from 'antd'
import moment, { Moment } from 'moment'
import { displayErrorMessage } from '../../../../lib/utils'

interface Props {
  price: number
  checkInDate: Moment | null
  checkOutDate: Moment | null
  setCheckInDate: (checkInDate: Moment | null) => void
  setCheckOutDate: (checkOutDate: Moment | null) => void
}

const { Paragraph, Title } = Typography

export const ListingCreateBooking = ({
  price,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
}: Props) => {
  const disabledDate = (currentDate: Moment) => {
    if (currentDate) {
      const currentDateIsBeforeEndOfToday = currentDate.isBefore(
        moment().endOf('day')
      )
      return currentDateIsBeforeEndOfToday
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
    }
    setCheckOutDate(selectedCheckOutDate)
  }

  const checkOutInputDisabled = !checkInDate
  const buttonDisabled = !checkInDate || !checkOutDate

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
      </Card>
    </div>
  )
}
